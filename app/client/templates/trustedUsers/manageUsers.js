/**
 * Created by toby on 14/08/15.
 */

Template.manageUsers.onRendered(function() {
  this.$('ul.tabs').tabs();
});

Template.manageUsers.helpers({
  hasData: function(arr) {
    return arr.count() > 0;
  }
});

var methodResponse = function(err, result) {
  if (result.error) {
    err = new Error(result.error);
  }
  if (err) {
    nqmTBX.ui.notification("command failed: " + err.message);
  }
  if (result && result.ok) {
    nqmTBX.ui.notification("command sent");
  }
};

Template.manageUsers.events({
  "click .nqm-status-btn": function(event) {
    var status = $(event.target).data("status");
    if (status === "deleted" || status === "declined") {
      Meteor.call("/app/trustedUser/delete", this.id, methodResponse);
    } else {
      Meteor.call("/app/trustedUser/setStatus", this.id, status, methodResponse);
    }
  }
});