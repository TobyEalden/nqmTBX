Meteor.startup(function () {
  Accounts.onLogin(function(details) {
    if (details.user.services.google.id) {
      console.log("user logged in with id: " + details.user.services.google.id);
    } else {
      console.log("non-google user logged in")
    }
  });
});
