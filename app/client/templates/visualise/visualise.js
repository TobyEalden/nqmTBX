/**
 * Created by toby on 01/07/15.
 */

/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
Template.visualise.events({
  "input, change, paste, keyup, mouseup #nqm-visualisation-search": function(e, template) {
    var searchTerm = new RegExp(e.target.value,"gi");
    var matches = feeds.find({ $or: [ {name: searchTerm}, {description: searchTerm }, {tags: searchTerm }]}).fetch();
    Session.set("visualisation-search", matches);
  },
  "click .nqm-dataset-card": function(event, template) {
    Router.go("visualisation");
  }
});

/*****************************************************************************/
/* Helpers */
/*****************************************************************************/
Template.visualise.helpers({
  searchResults: function() {
    return Session.get("visualisation-search");
  }
});