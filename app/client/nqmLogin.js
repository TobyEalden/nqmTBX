/**
 * Created by toby on 01/09/15.
 */

Meteor.loginWithNQM = function(service, token, cb) {
  var loginRequest = {
    nqm: true,
    service: service,
    token: token
  };

  Accounts.callLoginMethod({
    methodArguments: [ loginRequest ],
    userCallback: cb
  });
};