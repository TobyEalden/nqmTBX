/**
 * Created by toby on 13/08/15.
 */

Template.connect.events({
  "click #inviteLoginBtn": function(evt, template) {
    var config = {
      'client_id': Meteor.settings.public.googleClientId,
      'scope': 'https://www.googleapis.com/auth/userinfo.profile',
      'immediate': false,
      'authuser': 999
    };
    gapi.auth.authorize(config, function(err) {
      console.log(err);
      console.log('login complete');
      console.log(gapi.auth.getToken());
      Meteor.call("createConnectionRequest", { accessToken: gapi.auth.getToken().access_token });
    });
  }
});