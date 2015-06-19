/**
 * Created by toby on 14/06/15.
 */

Template.widgetDetail.onCreated(function() {
  Session.set("widgetType",undefined);
  Session.set("dataSource",undefined);
  Session.set("seriesField","timestamp");
  Session.set("dataField",undefined);

  // Fixed action button tooltips are sometimes left hanging around...
  $(".material-tooltip").hide();
});

Template.widgetDetail.helpers({
  showDataSources: function() {
    return Session.get("widgetType") === undefined ? "hide" : "";
  },
  showDataSourceConfigure: function() {
    return Session.get("dataSource") === undefined ? "hide" : "";
  },
  showFinish: function() {
    return Session.get("seriesField") && Session.get("dataField") ? "" : "hide";
  }
});

Template.widgetDetail.events({
  "change #seriesSelect": function(event, template) {
    Session.set("seriesField",$("#seriesSelect").val());
  },
  "change #dataSelect": function(event, template) {
    Session.set("dataField",$("#dataSelect").val());
  },
  "click #finishBtn": function(event, template) {
    // Create new widget configuration.
    var widget = {
      type: Session.get("widgetType").name,
      name: Session.get("dataSource").params.name,
      hubId: Session.get("dataSource").key.hubId,
      feedName: Session.get("dataSource").key.id,
      series: Session.get("seriesField"),
      datum: Session.get("dataField")
    };
    // Call server.
    Meteor.call("/app/widget/add", widget, function(err,result) {
      if (!err) {
        Router.go("visualise");
      } else {
        Materialize.toast(err.message, 4000);
      }
    });
  }
});

Template.widgetTypeButton.helpers({
  widgetTypeSelected: function() {
    return Session.get("widgetType") && Template.instance().data.name === Session.get("widgetType").name ? "amber accent-1" : "";
  }
});

Template.widgetTypeButton.events({
  "click .nqm-widget-type-selection": function(event, template) {
    Session.set("widgetType", template.data);
    Session.set("dataSource", undefined);
    Session.set("seriesField","timestamp");
    Session.set("dataField",undefined);
    if (template.data.name === "lineChart" || template.data.name === "scatterPlot") {
      Meteor.setTimeout(function() {
        var aTag = $("#chooseDataSource");
        $('html,body').animate({scrollTop: aTag.offset().top},'slow');
      },0);
    } else {
      Materialize.toast("not yet implemented",2000);
    }
  }
});

Template.dataSourceButton.events({
  "click .nqm-data-source-selection": function(event, template) {
    Session.set("dataSource", template.data);
    Meteor.setTimeout(function() {
      $('select').material_select();
      var aTag = $("#configureDataSource");
      $('html,body').animate({scrollTop: aTag.offset().top},'slow');
    },0);
  }
});

Template.dataSourceButton.helpers({
  dataSourceSelected: function() {
    return Session.get("dataSource") && Template.instance().data.params.name === Session.get("dataSource").params.name ? "amber accent-1" : "";
  }
});

Template.dataFieldSelect.onRendered(function() {
});

Template.dataFieldSelect.helpers({
  schemaFields: function() {
    return Session.get("dataSource") ? _.filter(Session.get("dataSource").params.schema.fields,function(i) { return i.name !== "timestamp"; }) : [];
  }
});