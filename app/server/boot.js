Accounts.onLogin(function(details) {
  //Meteor.users.update({_id: details.user._id},{$set:{username: details.user.nqmId }});
  //Accounts.setPassword(details.user._id,"toby");
  if (details.user.services.google.id) {
    console.log("user logged in with id: " + details.user.services.google.id);
  } else {
    console.log("non-google user logged in")
  }
});

Accounts.onCreateUser(function(opts,user) {
  if (opts.profile) {
    user.profile = opts.profile;
    if (!user.username) {
      // Create a username from the profile name (replace space with '.')
      user.username = user.profile.name.replace(/ /g,".");
    }
  }
  return user;
});

var handleGoogleAuth = function(token) {
  var userInfo;

  try {
    var result = HTTP.get("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + token);
    userInfo = {
      email: result.data.email
    };
  } catch (e) {
    console.log("failed to get token info from google: " + e.message);
  }

  return userInfo;
};

Accounts.registerLoginHandler("NQM",function(loginRequest) {
  if (!loginRequest.nqm) {
    return;
  }

  var serviceProvider = loginRequest.service;
  var accessToken = loginRequest.token;
  var user;

  if (serviceProvider === "google") {
    var userInfo = handleGoogleAuth(accessToken);
    user = Meteor.users.findOne({"services.google.email": userInfo.email});
  }

  if (user) {
    // Create a token and add it to the user
    var stampedToken = Accounts._generateStampedLoginToken();
    var hashStampedToken = Accounts._hashStampedToken(stampedToken);

    Meteor.users.update(user._id, {$push: {'services.resume.loginTokens': hashStampedToken}});
  }

  return {
    userId: user._id
  }
});

var connectHandler = WebApp.connectHandlers; // get meteor-core's connect-implementation

// attach connect-style middleware for response header injection
Meteor.startup(function () {
  connectHandler.use(function (req, res, next) {
    // TODO - Enforce https
    //res.setHeader('Strict-Transport-Security', 'max-age=2592000; includeSubDomains'); // 2592000s / 30 days
    if (req.originalUrl.indexOf("/authenticate/") === 0) {
      var url = Meteor.npmRequire("url");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Expose-Headers","x-nqm-xhr-redirect");
      // When sending the authentication page, include a header containing the URL.
      // This helps xhr clients know where to redirect to (as xhr doesn't see 302 responses).
      // TODO - review use of x-fowarded-proto
      var original = url.parse(req.headers["x-forwarded-proto"] + "://" + req.headers["host"] + req.originalUrl);
      delete original.search;
      var redirectUrl = url.format(original);
      res.setHeader("x-nqm-xhr-redirect", redirectUrl);
    }
    return next();
  })
})