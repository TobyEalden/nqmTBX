/**
 * Created by toby on 20/08/15.
 */

Template.authenticate.onCreated(function() {
  Meteor.logout();
});

Template.authenticate.events({
  "click #googleAuthButton": function(event, template) {
    Meteor.loginWithGoogle({ prompt: "select_account consent" }, function(err) {
      if (!err) {
        nqmTBX.ui.notification("external authentication");
        Meteor.call("/api/token/create", Meteor.user()._id, template.data.owner, function(err, result) {
          window.location.replace(template.data.returnURL + "?t=" + "xyz");
        });
      }
    });
  }
});