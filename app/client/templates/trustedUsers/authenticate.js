/**
 * Created by toby on 20/08/15.
 */

Template.authenticate.onCreated(function() {
  //Meteor.logout();
});

Template.authenticate.events({
  "click #googleAuthButton": function(event, template) {
    Session.set("share-auth",template.data);
    Meteor.loginWithGoogle({ prompt: "select_account consent" }, function(err) {
      if (!err) {
      }
    });
  }
});