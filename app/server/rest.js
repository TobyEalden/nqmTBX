/**
 * Created by toby on 31/08/15.
 */

var Cookies = Meteor.npmRequire("cookies");

var ALLOW_HEADERS = [
  'accept',
  'accept-version',
  'content-type',
  'request-id',
  'origin',
  'x-api-version',
  'x-request-id',
  'x-auth-token'
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
  var user;
  var cookies = new Cookies(this.request, this.response);

  // See if there is a currently logged in user.
  var nqmCookie = cookies.get("nqmT");
  if (nqmCookie) {
    user = Meteor.users.findOne({_id: nqmCookie});
  }

  // See if there is an authorisation header.
  if (!user && (this.request.headers["x-auth-token"] || this.request.query.access_token)) {
    var apiTokenHeader = this.request.headers["x-auth-token"] || this.request.query.access_token;
    if (apiTokenHeader) {
      var token = apiTokens.findOne({id: apiTokenHeader});
      if (token) {
        user = trustedUsers.findOne({ id: token.userId, status: "trusted", expires: { $gt: new Date() } });
      }
    }
  }

//  if (!user) {
////    var authURL = config.toolboxURL + uid + "/authenticate";
//    var authURL = "http://localhost:2222/" + "test.001" + "/authenticate";
//    var redirectURL = 'http' + '://' + this.request.headers.host + this.request.originalUrl;
//    this.response.writeHead(302, {
//      "Location": authURL + "?rurl=" + redirectURL,
//      "Access-Control-Allow-Origin":"*",
//      "Access-Control-Allow-Headers": ALLOW_HEADERS.join(",")
//    });
//    this.response.write(authURL);
//    this.done();
//  }
  return {
    user: user
  };
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
api._config.defaultHeaders["Access-Control-Allow-Headers"] = ALLOW_HEADERS.join(",");

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
      if (!ds.public) {
        // Dataset not public => need to authenticate.
        var authInfo = authUser.call(this);
        if (authInfo.user) {
          if (ds.private) {
            if (ds.owner === authInfo.user.nqmId) {
              // Dataset is private and owner is authenticated
              // PERMIT
            } else {
              // DENY
              return routeDenied();
            }
          } else {
            // Dataset not public or private => shared with specific users.
            // Find a share token for the authenticated user with the dataset scope.
            var tokens = shareTokens.find({ userId: trustedUser.userId, scope: scope, expires: { $gt: new Date() }, "resources.resource": "dataset", "resources.actions": "read" });
            if (tokens.length > 0) {
              // PERMIT
            } else {
              // DENY
              return routeDenied();
            }
          }
        } else {
          // Not authenticated.
          // DENY
          return routeDenied();
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