/**
 * Created by toby on 02/07/15.
 */

/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
Template.liveData.events({
  "click .nqm-feed-card": function(event, template) {
    var components = event.currentTarget.id.split("-");
    Router.go("/iotFeed/edit/" + components[1] + "/" + components[2]);
  }
});

/*****************************************************************************/
/* Helpers */
/*****************************************************************************/
Template.liveData.helpers({
  searchResults: function() {
    var searchTerm = new RegExp(Session.get("nqm-search"),"gi");
    return feeds.find({ $or: [ {name: searchTerm}, {description: searchTerm }, {tags: searchTerm }]}).fetch();
  }
});

Template.liveData.onRendered(function() {
  Session.set("modalBackLocation","/liveData");
});