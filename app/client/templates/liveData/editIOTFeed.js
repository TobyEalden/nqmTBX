
var flattenIndex = function(uniqueIndex) {
  var flat = [];
  _.forEach(uniqueIndex, function(i) {
    flat.push(i.asc ? i.asc : i.desc);
  });
  return flat.join(", ");
};

Template.editIOTFeed.helpers({
  isEdit: function() {
    return Template.instance().data ? true : false;
  },
  active: function(field) {
    return field ? "active" : "";
  },
  submitText: function() {
    return Template.instance().data ? "save": "create";
  },
  hubList: function() {
    var h = hubs.find({}).fetch();
    return h;
  },
  schemaJSON: function() {
    return Template.instance().data ? JSON.stringify(Template.instance().data.scheme,null,2) : "";
  },
  uniqueIndexJSON: function() {
    return Template.instance().data ? flattenIndex(Template.instance().data.uniqueIndex) : "";
  }
});

// ToDo - use a meteor package to do this (simpleSchema?)
var validateIOTFeed = function(form) {
  var errors = [];
  var feed = {};

  if (form.feedId.value.length > 0) {
    feed.feedId = form.feedId.value;
  }

  feed.hubId = form.hub.value;
  if (feed.hubId.length === 0) {
    errors.push("no hub specified");
  }

  feed.name = form.name.value;
  if (feed.name.length === 0) {
    errors.push("name is required");
  }

  feed.description = form.description.value;
  feed.tags = form.tags.value.split(/[\s,]+/);

  var idx = form.uniqueIndex.value.split(/[\s,]+/);
  // Don't think we need to insist on unique index for feeds.
  //
  //if (idx.length === 0) {
  //  errors.push("specify at least one unique key field");
  //} else {
    feed.uniqueIndex = [];
    // ToDo - support ascending/descending specification.
    _.forEach(idx, function(i) {
      feed.uniqueIndex.push({ "asc": i });
    });
  //}
  var schema;
  try {
    schema = JSON.parse(form.scheme.value || "{}");
    feed.schema = schema;
  } catch (e) {
    errors.push("invalid schema: " + e.message);
  }

  return { errors: errors, feed: feed };
};

Template.editIOTFeed.events({
  "submit #nqm-create-iot-feed-form": function(event) {
    var valid = validateIOTFeed(event.target);
    if (valid.errors.length > 0) {
      _.forEach(valid.errors, function(e) {
        Materialize.toast(e, 2000);
      });
    } else {
      var cb = function(err, result) {
        if (result.error) {
          err = new Error(result.error);
        }
        if (err) {
          Materialize.toast("save failed: " + err.message, 2000);
        }
        if (result && result.ok) {
          Materialize.toast("command sent",2000);
          Router.go("/liveData");
        }
      };

      if (Template.instance().data) {
        valid.feed.id = Template.instance().data.id;
        Meteor.call("/app/iotfeed/update", valid.feed, cb);
      } else {
        Meteor.call("/app/iotfeed/create", valid.feed, cb);
      }
    }

    return false;
  }
});

Template.editIOTFeed.onCreated(function () {
  //add your statement here
});

Template.editIOTFeed.onRendered(function () {
  // Force text area to auto-size on focus.
  $("#nqm-feed-schema").focus(function() {
    $(this).keyup();
  });
  // ToDo - fix this.
  Meteor.setTimeout(function() {
    $('select').material_select();
  }, 250);
});

Template.editIOTFeed.onDestroyed(function () {
  //add your statement here
});

