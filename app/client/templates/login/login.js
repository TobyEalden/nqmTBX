/**
 * Created by toby on 19/06/15.
 */

Template.login.events({
  "click #loginButton": function(evt, template) {
    Meteor.loginWithGoogle();
  }
});