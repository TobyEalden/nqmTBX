AppController = RouteController.extend({
  layoutTemplate: "mainLayout",
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      this.layout("unauthLayout");
      this.render("login");
    } else if (Meteor.user() && !Meteor.user().nqmId) {
      this.layout("unauthLayout");
      this.render("createAccount");
    } else {
      this.next();
    }
  }
});

ConnectController = RouteController.extend({
  layoutTemplate: "unauthLayout"
});

Router.configure({
  // Default controller.
  controller: AppController
});

var visualiseRoute =  {
  template: "visualise",
  layoutTemplate: "searchBrowseLayout",
  where: "client"
};

Router.route("/", visualiseRoute);
Router.route("/visualise", visualiseRoute);

Router.route("/visualise/create", {
  template: "visualisation",
  where: "client"
});

Router.route("/liveData", {
  template: "liveData",
  layoutTemplate: "searchBrowseLayout",
  where: "client"
});

Router.route("/datasets", {
  template: "datasets",
  layoutTemplate: "searchBrowseLayout",
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

Router.route("/dataset/create", {
  template: "editDataset",
  layoutTemplate: "modalLayout",
  where: "client"
});

Router.route("/dataset/edit/:id", {
  template: "editDataset",
  layoutTemplate: "modalLayout",
  where: "client",
  data: function() { return datasets.findOne({id: this.params.id }); }
});

Router.route("/logout");

Router.route("/connect/:zoneId", {
  controller: ConnectController,
  template: "connect",
  data: function() { return { zoneId: this.params.zoneId }}
});

Router.route("/manageUsers", {
  template: "manageUsers",
  layoutTemplate: "searchBrowseLayout",
  waitOn: function() { return [ Meteor.subscribe("trustedUsers") ]; },
  where: "client",
  data: function() {
    return {
      trusted: trustedUsers.find({ status: "trusted", expires: { $gt: new Date() } }),
      expired: trustedUsers.find({ status: "trusted", expires: { $lt: new Date() } }),
      pending: trustedUsers.find({ status: "pending" }),
      revoked: trustedUsers.find({ status: "revoked" })
    }
  }
});

Router.route("/createTrustedUser", {
  template: "editTrustedUser",
  layoutTemplate: "modalLayout",
  where: "client"
});