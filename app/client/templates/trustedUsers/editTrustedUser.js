/**
 * Created by toby on 14/08/15.
 */

Template.editTrustedUser.helpers({
  active: function() {
    return "";
  }
});

Template.editTrustedUser.events({
  "submit #nqm-trusted-user-form": function(event) {

    var cb = function(err, result) {
      if (result.error) {
        err = new Error(result.error);
      }
      if (err) {
        nqmTBX.ui.notification("save failed: " + err.message, 2000);
      }
      if (result && result.ok) {
        nqmTBX.ui.notification("command sent",2000);
        Router.go("/manageUsers");
      }
    };

    var form = event.target;
    var expiryDays = 1;
    var valid = {
      id: Random.id(),
      userId: form.userId.value,
      issued: Date.now(),
      expires: Date.now() + expiryDays * 86400000,
      status: "pending"
    };

    if (Template.currentData()) {
      // Update
    } else {
      // Create
      Meteor.call("/app/trustedUser/create", valid, cb);
    }

    return false;
  }
});