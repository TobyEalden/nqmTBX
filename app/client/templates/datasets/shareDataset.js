/**
 * Created by toby on 21/08/15.
 */

Template.shareDataset.onCreated(function() {
  Session.set("datasetShareMatch","");
});

var getMatches = function() {
  var lookup = Session.get("datasetShareMatch");
  if (lookup.length > 0) {
    var searchTerm = new RegExp(lookup,"gi");
    return trustedUsers.find({ userId: searchTerm}).fetch();
  } else {
    return [];
  }
};

Template.shareDataset.helpers({
  active: function (field) {
    return field ? "active" : "";
  },
  haveMatches: function() { return getMatches().length > 0; },
  shareMatch: getMatches
});

Template.shareDataset.events({
  "input, change, paste, keyup, mouseup #nqm-subject-name": function(e, template) {
    Session.set("datasetShareMatch", e.target.value);
  },
  "click .collection-item": function(e, template) {
    template.$("#nqm-subject-name").val(this.userId);
    Session.set("datasetShareMatch","");
    return false;
  },
  "submit #nqm-share-form": function(e, template) {
    if (e.target.subject.value.length === 0) {
      nqmTBX.ui.notification("specify user to share with");
    } else {
      var cb = function(err, result) {
        if (result.error) {
          err = new Error(result.error);
        }
        if (err) {
          nqmTBX.ui.notification("share failed: " + err.message);
        }
        if (result && result.ok) {
          nqmTBX.ui.notification("command sent, " + result.result.id);
          Router.go("/datasets");
        }
      };

      var params = {
        userId: e.target.subject.value,
        scope: template.data.dataset.id,
        resources: [
          { resource: "dataset", actions: ["read"] }
        ],
        issued: Date.now(),
        expires: Date.now() + 24*60*60*1000
      };
      Meteor.call("/api/token/create", params, cb);
    }

    return false;
  }
});