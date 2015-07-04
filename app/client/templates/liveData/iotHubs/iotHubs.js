/**
 * Created by toby on 03/07/15.
 */

Template.iotHubs.helpers({
  searchResults: function() {
    var searchTerm = new RegExp(Session.get("nqm-search"),"gi");
    return hubs.find({ $or: [ {name: searchTerm}, {description: searchTerm }, {tags: searchTerm }]}).fetch();
  }
});

Template.iotHubs.events({
  "click .nqm-feed-card": function(event, template) {
    Router.go("/iotHub/edit/" + event.currentTarget.id.split("-")[1]);
  }
});

Template.iotHubs.onRendered(function() {
  Session.set("modalBackLocation","/iotHubs");
});