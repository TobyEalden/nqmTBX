Router.configure({
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});

var visualiseRoute =  {
  template: "visualise",
  layoutTemplate: "mainLayout",
  where: "client"
};

Router.route("/", visualiseRoute);
Router.route("/visualise", visualiseRoute);

Router.route("/feeds", {
  template: "feeds",
  layoutTemplate: "mainLayout",
  where: "client"
});

Router.route("/widgetDetail", {
  template: "widgetDetail",
  layoutTemplate: "mainLayout",
  where: "client",
  waitOn: function() {
    return [Meteor.subscribe("widgetTypes"), Meteor.subscribe("feedName")];
  },
  data: function() {
    return {
      widgetType: widgetTypes.find(),
      feedName: feeds.find({ evtName: "created"})
    }
  }
});