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

var authUser = function() {
  var userInfo = {};
  var cookies = new Cookies(this.request, this.response);

  // See if there is an authorisation header.
  var apiTokenHeader;
  if (this.request.headers["authorization"]) {
    var parse = this.request.headers["authorization"].split(" ");
    if (parse.length > 1 && parse[0] === "nqm") {
      apiTokenHeader = parse[1];
    }
  } else if (this.request.query.t) {
    apiTokenHeader = this.request.query.t;
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
      if (token.referer !== getClientIP(this.request)) {
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

  //if (!userInfo.userId) {
  //  // No access token found, see if there is a currently logged in user.
  //  var nqmCookie = cookies.get("nqm");
  //  if (nqmCookie) {
  //    var user = Meteor.users.findOne({_id: nqmCookie});
  //    if (user && user.status.lastLogin.ipAddr === getClientIP(this.request)) {
  //      userInfo.loggedIn = user.nqmId;
  //    }
  //  }
  //}

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

var routeAuthenticate = function(owner) {
  var jt = jwt.encode({
    iss: owner,
    expires: moment().add(Meteor.settings.authenticationTokenTimeout, "minutes").valueOf(),
    referer: getClientIP(this.request)
  }, Meteor.settings.APIKey);

  var authURL = process.env.ROOT_URL + "authenticate/" + jt;
  var redirectURL = this.request.connection.encrypted ? "https" : "http" + '://' + this.request.headers.host + this.request.originalUrl;

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

api.addRoute("datasets/:id", {
  get: function() {
    var ds = datasets.findOne({id: this.urlParams.id});
    if (ds) {
      if (ds.shareMode !== "public") {
        // Dataset not public => need to authenticate.
        var authInfo = authUser.call(this);
        if (authInfo.userId || authInfo.owner) {
          // There is an authenticated user.
          if (ds.owner === authInfo.loggedIn || ds.owner === authInfo.token.subId) {
            // Owner is authenticated
            // PERMIT
          } else if (ds.shareMode === "specific") {
            // Dataset is shared with specific users.
            // Find a share token for the authenticated user with the dataset scope.
            var tokens = shareTokens.find({ owner: ds.owner, userId: authInfo.userId, scope: ds.id, expires: { $gt: new Date() }, "resources.resource": "dataset", "resources.actions": "read" }).fetch();
            if (tokens.length > 0) {
              // Found a valid share token for the authenticated user.
              // PERMIT
            } else {
              // No share token found.
              // DENY
              return routeDenied();
            }
          } else {
            // Dataset is private
            // DENY
            return routeDenied();
          }
        } else {
          // Not authenticated.
          // DENY - and re-direct.
          return routeAuthenticate.call(this, ds.owner);
        }
      } else {
        // Dataset is public.
        // PERMIT
      }
    } else {
      // No dataset found.
      // 404
      return routeNotFound();
    }

    return ds;
  }
});