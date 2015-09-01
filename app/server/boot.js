Accounts.onLogin(function(details) {
  //Meteor.users.update({_id: details.user._id},{$set:{username: details.user.nqmId }});
  //Accounts.setPassword(details.user._id,"toby");
  if (details.user.services.google.id) {
    console.log("user logged in with id: " + details.user.services.google.id);
  } else {
    console.log("non-google user logged in")
  }
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