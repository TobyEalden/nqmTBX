/**
 * Created by toby on 31/08/15.
 */

var Cookies = Meteor.npmRequire("cookies");
var jwt = Meteor.npmRequire("jwt-simple");

var ALLOW_HEADERS = [
  'accept',
  'accept-version',
  'content-type',
  'request-id',
  'origin',
  'x-api-version',
  'x-request-id',
  'authorization'
];

// HACK - bug in restivus doesn't return correct remote address.
// https://github.com/kahmali/meteor-restivus/issues/74
var getClientIP = function(request) {
  var ip = request.connection.remoteAddress;
  if (request.headers["x-forwarded-for"]) {
    var split = request.headers["x-forwarded-for"].split(", ");
    if (split.length > 0) {
      ip = split[0];
    }
  }

  return ip;
};

var getTokenDetails = function(request) {
  var userInfo = {};

  // See if there is an authorisation header.
  var apiTokenHeader;
  if (request.headers["authorization"]) {
    var parse = request.headers["authorization"].split(" ");
    if (parse.length > 1 && parse[0] === "nqm") {
      apiTokenHeader = parse[1];
    }
  } else if (request.query.t) {
    apiTokenHeader = request.query.t;
  }

  if (apiTokenHeader) {
    try {
      // Decode the api token.
      var token = jwt.decode(apiTokenHeader, Meteor.settings.APIKey);

      // Check the expiry.
      if (token.exp <= Date.now()) {
        throw new Error("token expired");
      }

      // Check the referer.
      if (token.referer !== getClientIP(request)) {
        throw new Error("bad referer");
      }

      // Find a trusted user.
      var trusted = trustedUsers.findOne({ id: token.sub, owner: token.iss, status: "trusted", expires: { $gt: new Date() } });
      if (!trusted) {
        throw new Error("no trusted user");
      }

      userInfo.userId = trusted.userId;
      userInfo.token = token;

    } catch (e) {
      console.log("Failed to get api token - " + e.message);
    }
  }

  return userInfo;
};

var defaultOptionsEndpoint = function() {
  var corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': ALLOW_HEADERS.join(",")
  };
  this.response.writeHead(200, corsHeaders);
  return this.done();
};

var api = new Restivus({
  defaultOptionsEndpoint: defaultOptionsEndpoint
});

// HACK - enable Authorization CORS header.
// TODO - fix and issue PR to restivus repo.
api._config.defaultHeaders["Access-Control-Expose-Headers"] = "x-nqm-xhr-redirect";

var routeDenied = function() {
  return {
    statusCode: 401,
    headers: {
      'Content-Type': 'text/plain'
    },
    body: '401 - unauthorised'
  };
};

var routeNotFound = function() {
  return {
    statusCode: 404,
    headers: {
      'content-type': 'text/plain',
    },
    body: '404 - not found'
  };
};

var routeAuthenticate = function(request, owner) {
  var jt = jwt.encode({
    iss: owner,
    expires: moment().add(Meteor.settings.authenticationTokenTimeout, "minutes").valueOf(),
    referer: getClientIP(request)
  }, Meteor.settings.APIKey);

  var authURL = process.env.ROOT_URL + "authenticate/" + jt;
  var redirectURL = request.connection.encrypted ? "https" : "http" + '://' + request.headers.host + request.originalUrl;

  return {
    statusCode: 302,
    headers: {
      'Content-Type': 'text/plain',
      'Location': authURL + "?rurl=" + redirectURL,
      "Access-Control-Allow-Origin":"*",
      "Access-Control-Allow-Headers": ALLOW_HEADERS.join(","),
      "Access-Control-Expose-Headers":"x-nqm-xhr-redirect"
    },
    body: '302 - authenticate - ' + authURL
  };
};

var routeRequestAccess = function(request, resource) {
  var jt = jwt.encode({
    iss: resource.owner,
    expires: moment().add(Meteor.settings.authenticationTokenTimeout, "minutes").valueOf(),
    referer: getClientIP(request)
  }, Meteor.settings.APIKey);

  var authURL = process.env.ROOT_URL + "requestAccess/" + jt;
  var redirectURL = request.connection.encrypted ? "https" : "http" + '://' + request.headers.host + request.originalUrl;

  return {
    statusCode: 302,
    headers: {
      'Content-Type': 'text/plain',
      'Location': authURL + "?rurl=" + redirectURL,
      "Access-Control-Allow-Origin":"*",
      "Access-Control-Allow-Headers": ALLOW_HEADERS.join(","),
      "Access-Control-Expose-Headers":"x-nqm-xhr-redirect"
    },
    body: '302 - authenticate - ' + authURL
  };
};

function authorised(request, resource, accessRequired) {
  var authorise = {
    permit: false
  };

  // Default to read-only access.
  accessRequired = accessRequired || "read";

  if (!resource) {
    // No resource found => 404
    authorise.response = routeNotFound();
  } else if (resource.shareMode === "public") {
    // Resource is public => PERMIT
    authorise.permit = true;
  } else {
    // Resource not public => need to authenticate.
    var authInfo = getTokenDetails(request);
    if (authInfo.userId || authInfo.owner) {
      // There is an authenticated user.
      if (resource.owner === authInfo.token.subId) {
        // Owner of the resource is authenticated => PERMIT
        authorise.permit = true;
      } else if (resource.shareMode === "specific") {
        // Resource is shared with specific users.
        // Find a share token for the authenticated user with the resource scope.
        var tokens = shareTokens.find({ owner: resource.owner, userId: authInfo.userId, scope: resource.id, expires: { $gt: new Date() }, "resources.resource": "access", "resources.actions": accessRequired }).fetch();
        if (tokens.length > 0) {
          // Found a valid share token for the authenticated user => PERMIT
          authorise.permit = true;
        } else {
          // No share token found => DENY and re-direct to access request.
          authorise.response = routeRequestAccess(request, resource);
        }
      } else {
        // Dataset is private => DENY
        authorise.response = routeDenied();
      }
    } else {
      // Not authenticated => DENY and re-direct.
      authorise.response = routeAuthenticate(request, resource.owner);
    }
  }

  if (authorise.permit) {
    authorise.response = resource;
  }

  return authorise;
}

api.addRoute("datasets/:id", {
  get: function() {
    var ds = datasets.findOne({id: this.urlParams.id});
    var auth = authorised(this.request, ds);
    return auth.response;
  }
});

api.addRoute("datasets/:id/data", {
  get: function() {
    var ds = datasets.findOne({id: this.urlParams.id});
    var auth = authorised(this.request, ds);
    if (!auth.permit) {
      // Not permitted.
      return auth.response;
    }
    // Have permission to access dataset.
    var data = datasetDataCache[ds.store];
    return data.find().fetch();
  }
});