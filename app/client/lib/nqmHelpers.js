/**
 * Created by toby on 02/09/15.
 */

if (!nqmTBX) {
  nqmTBX = {};
}

if (!nqmTBX.helpers) {
  nqmTBX.helpers = {};
}

nqmTBX.helpers.logout = function() {
  docCookies.removeItem("nqmT","/");
  Meteor.logout();
  FlowRouter.go("/");
};