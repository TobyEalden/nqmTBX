/**
 * Created by toby on 19/06/15.
 */

Template.login.events({
  "click #loginButton": function(evt, template) {
    Meteor.loginWithGoogle(function(err) {
      if (!err) {
        nqmTBX.ui.notification("logged in");
        //if (Meteor.user().nqmId) {
        //  nqmTBX.ui.notification("nqm user is: " + Meteor.user().nqmId);
        //} else {
        //  Router.go("createUser");
        //}
      }
    });
  }
});