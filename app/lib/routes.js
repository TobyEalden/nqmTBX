Router.configure({
  layoutTemplate: "mainLayout",
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.onBeforeAction(function() {
  if (!Meteor.userId()) {
    this.render("login");
  } else {
    this.next();
  }
});

var visualiseRoute =  {
  template: "visualise",
  layoutTemplate: "searchBrowseLayout",
  where: "client"
};

Router.route("/", visualiseRoute);
Router.route("/visualise", visualiseRoute);

Router.route("/visualisation", {
  template: "visualisation",
  where: "client"
});

Router.route("/liveData", {
  template: "liveData",
  layoutTemplate: "searchBrowseLayout",
  where: "client"
});

Router.route("/feeds", {
  template: "feeds",
  where: "client"
});

Router.route("/widgetDetail", {
  template: "widgetDetail",
  where: "client",
  waitOn: function() {
    return [Meteor.subscribe("widgetTypes"), Meteor.subscribe("feeds")];
  },
  data: function() {
    return {
      widgetType: widgetTypes.find(),
      feed: feeds.find()
    }
  }
});

Router.route("/iotHubs", {
  template: "iotHubs",
  layoutTemplate: "searchBrowseLayout",
  where: "client",
  data: function() { return { searchTerm: "" }; }
});

Router.route("/IOTHub/create", {
  template: "editIOTHub",
  layoutTemplate: "modalLayout",
  where: "client"
});

Router.route("/IOTHub/edit/:id", {
  template: "editIOTHub",
  layoutTemplate: "modalLayout",
  where: "client",
  data: function() { return hubs.findOne({id: this.params.id }); }
});

Router.route("/IOTFeed/create", {
  template: "editIOTFeed",
  layoutTemplate: "modalLayout",
  where: "client"
});

Router.route("/IOTFeed/edit/:hubId/:id", {
  template: "editIOTFeed",
  layoutTemplate: "modalLayout",
  where: "client",
  data: function() { return feeds.findOne({hubId: this.params.hubId, id: this.params.id }); }
});

Router.route("/logout");