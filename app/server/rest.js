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

var EXPOSE_HEADERS = [
  'api-version',
  'content-length',
  'content-md5',
  'content-type',
  'date',
  'request-id',
  'response-time'
];

var authUser = function() {
  var userInfo = {};
  var cookies = new Cookies(this.request, this.response);

  // See if there is a currently logged in user.
  var nqmCookie = cookies.get("nqmT");
  if (nqmCookie) {
    var user = Meteor.users.findOne({_id: nqmCookie});
    userInfo.nqmId = user.nqmId;
  }

  // See if there is an authorisation header.
  if (!userInfo.nqmId) {
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
      var token = apiTokens.findOne({id: apiTokenHeader});
      if (token) {
        var trusted = trustedUsers.findOne({ id: token.userId, status: "trusted", expires: { $gt: new Date() } });
        userInfo.nqmId = trusted.owner;
        userInfo.userId = trusted.userId;
      }
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
  auth: {
    user: authUser
  },
  defaultOptionsEndpoint: defaultOptionsEndpoint,
  //defaultHeaders: {
  //  //"Content-Type": "application/json",
  //  //"Access-Control-Allow-Origin": "*",
  //  //"Access-Control-Allow-Headers": "sid, lang, origin, authorization, content-type, withcredentials, x-requested-with"
  //}
});

// HACK - enable Authorization CORS header. TODO - fix
//api._config.defaultHeaders["Access-Control-Allow-Headers"] = ALLOW_HEADERS.join(",");
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
      'Content-Type': 'text/plain',
    },
    body: '404 - not found'
  };
};

api.addRoute("datasets/:id", {
  get: function() {
    var ds = datasets.findOne({id: this.urlParams.id});
    if (ds) {
      if (ds.shareMode !== "public") {
        // Dataset not public => need to authenticate.
        var authInfo = authUser.call(this);
        if (authInfo.nqmId) {
          if (ds.owner === authInfo.nqmId) {
            // Owner is authenticated
            // PERMIT
          } else if (ds.shareMode === "specific") {
            // Dataset is shared with specific users.
            // Find a share token for the authenticated user with the dataset scope.
            var tokens = shareTokens.find({ owner: ds.owner, userId: authInfo.userId, scope: ds.id, expires: { $gt: new Date() }, "resources.resource": "dataset", "resources.actions": "read" });
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
          // DENY - and re-direct?
          //    var authURL = config.toolboxURL + uid + "/authenticate";
          var authURL = "http://localhost:2222" + "/authenticate/" + ds.owner;
          var redirectURL = 'http' + '://' + this.request.headers.host + this.request.originalUrl;
          return {
            statusCode: 302,
            headers: {
              'Content-Type': 'text/plain',
              'Location': authURL + "?rurl=" + redirectURL,
              "Access-Control-Allow-Origin":"*",
              "Access-Control-Allow-Headers": ALLOW_HEADERS.join(","),
              "Access-Control-Expose-Headers":"x-nqm-xhr-redirect"
        },
            body: '302 - authenticate' + authURL
          };
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