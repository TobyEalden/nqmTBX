
var themes = {
  "blue-grey": {
    mainColour: "blue-grey lighten-1 white-text z-depth-1",
    menuTextColour: "grey-text text-lighten-3",
    mainTextColour: "white-text",
    visualisationBackground: "grey darken-3 grey-text text-lighten-1 z-depth-3",
    visualisationTitle: "white-text text-lighten-2",
    background: "blue-grey darken-2 grey-text text-lighten-5",
    actionButton: "amber darken-2 white-text z-depth-2",
    sideNav: "blue-grey lighten-2 white-text z-depth-0"
  },
  "indigo": {
    mainColour: "indigo z-depth-1",
    menuTextColour: "grey-text text-lighten-3",
    mainTextColour: "white-text",
    visualisationBackground: "grey lighten-3 grey-text text-darken-1 z-depth-2",
    background: "grey lighten-2 grey-text text-darken-4",
    actionButton: "red white-text",
    sideNav: "indigo lighten-1 white-text z-depth-0"
  },
  "teal": {
    mainColour: "teal darken-2 z-depth-3",
    menuTextColour: "grey-text text-lighten-3",
    mainTextColour: "white-text",
    visualisationBackground: "grey darken-3 grey-text text-lighten-1 z-depth-2",
    visualisationTitle: "teal-text text-darken-4",
    background: "grey lighten-2 grey-text text-darken-3",
    actionButton: "red white-text",
    sideNav: "teal darken-1 grey-text text-lighten-3 z-depth-0"
  },
  "amber": {
    mainColour: "amber darken-1 z-depth-2",
    menuTextColour: "black-text text-lighten-2",
    mainTextColour: "deep-orange-text text-darken-4",
    visualisationBackground: "grey darken-3 grey-text text-lighten-1 z-depth-2",
    background: "grey darken-2 grey-text text-lighten-5",
    actionButton: "red white-text",
    sideNav: "amber black-text z-depth-0"
  },
  "grey": {
    mainColour: "grey darken-1 z-depth-2",
    menuTextColour: "grey-text text-lighten-2",
    mainTextColour: "black-text text-darken-4",
    visualisationBackground: "grey darken-3 grey-text text-lighten-1 z-depth-2",
    visualisationTitle: "orange-text",
    background: "grey darken-2 grey-text text-lighten-5",
    actionButton: "red white-text",
    sideNav: "grey grey-text text-lighten-2 z-depth-0"
  }
};

Template.registerHelper("theme", function() {
  return themes[Session.get("theme") || "blue-grey"];
});

Meteor.startup(function() {
  Session.set("themes",themes);

  Tracker.autorun(function() {
    $("body").removeClass();
    $("body").addClass(themes[Session.get("theme") || "blue-grey"].background);
  });

  Meteor.subscribe("widgetTypes");
  Meteor.subscribe("feeds", function() {
    feeds.find().observe({
      added: function(feed) {
        console.log("adding feed %s", feed.store);
        feedDataCache[feed.store] = new Mongo.Collection(feed.store);
      },
      removed: function(feed) {
        console.log("removing feed %s", feed.store);
        delete feedDataCache[feed.store];
      }
    });
  });
});