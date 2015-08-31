/**
 * Created by toby on 31/08/15.
 */

var Cookies = Meteor.npmRequire("cookies");

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

  if (!user) {
//    var authURL = config.toolboxURL + uid + "/authenticate";
    var authURL = "http://localhost:2222/" + "test.001" + "/authenticate";
    var redirectURL = 'http' + '://' + this.request.headers.host + this.request.originalUrl;
    this.response.writeHead(302, {
      "Location": authURL + "?rurl=" + redirectURL,
      "access-control-allow-headers":"Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token",
      "access-control-allow-origin":"*"
    });
    this.response.write(authURL);
    //this.response.statusCode = 302;
    //this.response.statusMessage = authURL;
    this.done();
  }
  return {
    user: user
  };
};

var defaultOptionsEndpoint = function() {
  var corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token'
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

// HACK - enable Authorization CORS header.
api._config.defaultHeaders["Access-Control-Allow-Headers"] += ", X-Auth-Token";
//api._config.defaultHeaders["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";

api.addRoute("datasets/:id", { authRequired: true }, {
  get: function() {
    return datasets.findOne({id: this.urlParams.id});
  }
});