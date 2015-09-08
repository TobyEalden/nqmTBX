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
  Meteor.logout();
  FlowRouter.go("/");
};

nqmTBX.helpers.methodCallback = function(code) {
  return function(err, result) {
    if (err) {
      nqmTBX.ui.notification(code + " failed: " + err.message);
    }
    if (result && result.ok) {
      nqmTBX.ui.notification(code + " command sent, " + result.result.id);
    }
  };
};
