/**
 * Created by toby on 02/09/15.
 */

if (!nqmTBX) {
  nqmTBX = {};
}

nqmTBX.helpers = {
  neverExpire: moment().year(270000).startOf("year"),
  logout: function() {
    Meteor.logout();
    FlowRouter.go("/");
  },
  methodCallback: function(code) {
    return function(err, result) {
      if (err) {
        nqmTBX.ui.notification(code + " failed: " + err.message);
      }
      if (result && result.ok) {
        nqmTBX.ui.notification(code + " command sent, " + result.result.id);
      }
    };
  }
};


