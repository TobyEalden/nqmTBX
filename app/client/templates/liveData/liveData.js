/**
 * Created by toby on 02/07/15.
 */

/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
Template.liveData.events({
  "input, change, paste, keyup, mouseup #nqm-feed-search": function(e, template) {
    var searchTerm = new RegExp(e.target.value,"gi");
    var matches = feeds.find({ $or: [ {name: searchTerm}, {description: searchTerm }, {tags: searchTerm }]}).fetch();
    Session.set("feed-search", matches);
  },
  "click .nqm-feed-card": function(event, template) {
    Router.go("liveData");
  }
});

/*****************************************************************************/
/* Helpers */
/*****************************************************************************/
Template.liveData.helpers({
  searchResults: function() {
    return Session.get("feed-search");
  }
});