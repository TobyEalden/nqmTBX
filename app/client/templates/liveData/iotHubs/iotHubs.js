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
});

Template.iotHubs.onRendered(function() {
  Session.set("modalBackLocation","/iotHubs");
});