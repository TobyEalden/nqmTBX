
var flattenIndex = function(uniqueIndex) {
  var flat = [];
  _.forEach(uniqueIndex, function(i) {
    flat.push(i.asc ? i.asc : i.desc);
  });
  return flat.join(", ");
};

Template.editDataset.helpers({
  active: function(field) {
    return field ? "active" : "";
  },
  submitText: function() {
    return Template.instance().data ? "save": "create";
  },
  schemaJSON: function() {
    return Template.instance().data ? JSON.stringify(Template.instance().data.scheme,null,2) : "";
  },
  uniqueIndexJSON: function() {
    return Template.instance().data ? flattenIndex(Template.instance().data.uniqueIndex) : "";
  }
});

// ToDo - use a meteor package to do this (simpleSchema?)
var validateDataset = function(form) {
  var errors = [];
  var dataset = {};

  dataset.name = form.name.value;
  if (dataset.name.length === 0) {
    errors.push("name is required");
  }

  dataset.description = form.description.value;
  dataset.tags = form.tags.value.split(",");

  var idx = form.uniqueIndex.value.split(",");
  if (idx.length === 0) {
    errors.push("specify at least one unique key field");
  } else {
    dataset.uniqueIndex = [];
    // ToDo - support ascending/descending specificaton.
    _.forEach(idx, function(i) {
      dataset.uniqueIndex.push({ "asc": i });
    });
  }
  var schema;
  try {
    schema = JSON.parse(form.scheme.value || "{}");
    dataset.schema = schema;
  } catch (e) {
    errors.push("invalid schema: " + e.message);
  }

  return { errors: errors, dataset: dataset };
};

Template.editDataset.events({
  "submit #nqm-create-dataset-form": function(event) {
    var valid = validateDataset(event.target);
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
          Router.go("/datasets");
        }
      };

      if (Template.instance().data) {
        valid.dataset.id = Template.instance().data.id;
        Meteor.call("/app/dataset/update", valid.dataset, cb);
      } else {
        Meteor.call("/app/dataset/create", valid.dataset, cb);
      }
    }

    return false;
  }
});

Template.editDataset.onCreated(function () {
  //add your statement here
});

Template.editDataset.onRendered(function () {
  // Force text area to auto-size on focus.
  $("#nqm-dataset-schema").focus(function() {
    $(this).keyup();
  });
});

Template.editDataset.onDestroyed(function () {
  //add your statement here
});

