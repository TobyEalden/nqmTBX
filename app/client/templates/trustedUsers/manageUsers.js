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

Template.manageUsers.events({
  "click .nqm-status-btn": function(event) {
    var status = $(event.target).data("status");
    Meteor.call("/app/trustedUser/setStatus",this.id, "accept", function(err, result) {
      if (result.error) {
        err = new Error(result.error);
      }
      if (err) {
        nqmTBX.ui.notification("save failed: " + err.message, 2000);
      }
      if (result && result.ok) {
        nqmTBX.ui.notification("command sent",2000);
      }
    });
  }
});