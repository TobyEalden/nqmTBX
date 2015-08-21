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
        Meteor.call("/api/token/create", template.data.tuid, function(err, result) {
          window.location.href = template.data.returnURL;
        });
      }
    });
  }
});