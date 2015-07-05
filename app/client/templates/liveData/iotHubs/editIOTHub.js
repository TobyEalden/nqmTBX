Template.editIOTHub.helpers({
  active: function(field) {
    return field && field.length > 0 ? "active" : "";
  },
  submitText: function() {
    return Template.instance().data ? "save": "create";
  }
});

Template.editIOTHub.events({
  "submit #nqm-create-iot-hub-form": function(event) {
    var opts = {
      name: event.target.name.value,
      description: event.target.description.value,
      tags: event.target.tags.value.split(/[\s,]+/)
    };

    var cb = function(err, result) {
      if (result.error) {
        err = new Error(result.error);
      }
      if (err) {
        Materialize.toast("save failed: " + err.message, 2000);
      }
      if (result && result.ok) {
        Materialize.toast("command sent",2000);
        Router.go("/iotHubs");
      }
    };

    if (Template.instance().data) {
      opts.id = Template.instance().data.id;
      Meteor.call("/app/iothub/update", opts, cb);
    } else {
      Meteor.call("/app/iothub/create", opts, cb);
    }
    return false;
  }
});

Template.editIOTHub.onCreated(function () {
  //add your statement here
});

Template.editIOTHub.onRendered(function () {
  //add your statement here
});

Template.editIOTHub.onDestroyed(function () {
  //add your statement here
});

