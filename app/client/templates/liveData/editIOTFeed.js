Template.editIOTFeed.helpers({
  active: function(field) {
    return field && field.length > 0 ? "active" : "";
  },
  submitText: function() {
    return Template.instance().data ? "save": "create";
  },
  hubList: function() {
    var h = hubs.find({}).fetch();
    return h;
  }
});

Template.editIOTFeed.events({
  "submit #nqm-create-iot-feed-form": function(event) {
    var opts = {
      name: event.target.name.value,
      description: event.target.description.value,
      tags: event.target.tags.value.split(/[\s,]+/)
    };

    var cb = function(err, result) {
      if (err) {
        Materialize.toast("save failed: " + err.message, 2000);
      }
      if (result && result.ok) {
        Materialize.toast("saved",2000);
        Router.go("/liveData");
      }
    };

    if (Template.instance().data) {
      opts.id = Template.instance().data.id;
      Meteor.call("/app/iotfeed/update", opts, cb);
    } else {
      Meteor.call("/app/iotfeed/create", opts, cb);
    }
    return false;
  }
});

Template.editIOTFeed.onCreated(function () {
  //add your statement here
});

Template.editIOTFeed.onRendered(function () {
  // ToDo - fix this.
  Meteor.setTimeout(function() {
    $('select').material_select();
  }, 250);
});

Template.editIOTFeed.onDestroyed(function () {
  //add your statement here
});

