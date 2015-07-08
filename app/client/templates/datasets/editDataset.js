
var flattenIndex = function(uniqueIndex) {
  var flat = [];
  _.forEach(uniqueIndex, function(i) {
    flat.push(i.asc ? i.asc : i.desc);
  });
  return flat.join(", ");
};

Template.editDataset.helpers({
  isEdit: function() {
    return Template.instance().data ? true : false;
  },
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
  dataset.tags = form.tags.value.split(/[\s,]+/);

  var idx = form.uniqueIndex.value.split(/[\s,]+/);
  if (idx.length === 0) {
    errors.push("specify at least one unique key field");
  } else {
    dataset.uniqueIndex = [];
    // ToDo - support ascending/descending specification.
    _.forEach(idx, function(i) {
      if (i.length > 0) {
        dataset.uniqueIndex.push({ "asc": i });
      }
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
  "submit #nqm-create-dataset-form": function(event, template) {
    var valid = validateDataset(event.target);
    if (valid.errors.length > 0) {
      _.forEach(valid.errors, function(e) {
        nqmTBX.ui.notification(e, 2000);
      });
    } else {
      var cb = function(err, result) {
        if (result.error) {
          err = new Error(result.error);
        }
        if (err) {
          nqmTBX.ui.notification("save failed: " + err.message, 2000);
        }
        if (result && result.ok) {
          nqmTBX.ui.notification("command sent",2000);
          Router.go("/datasets");
        }
      };

      if (template.data) {
        valid.dataset.id = template.data.id;
        Meteor.call("/app/dataset/update", valid.dataset, cb);
      } else {
        Meteor.call("/app/dataset/create", valid.dataset, cb);
      }
    }

    return false;
  },
  "click #nqm-dataset-delete": function(event, template) {
    Meteor.call("/app/dataset/delete", template.data.id, function(err, result) {
      if (result.error) {
        err = new Error(result.error);
      }
      if (err) {
        nqmTBX.ui.notification("delete failed: " + err.message, 2000);
      }
      if (result && result.ok) {
        nqmTBX.ui.notification("command sent",2000);
        Router.go("/datasets");
      }
    });
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

