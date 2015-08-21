/**
 * Created by toby on 02/07/15.
 */

/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
Template.datasets.events({
  "click .nqm-dataset-card": function(event, template) {
    // Ignore events bubbled from anchor elements.
    if (event.target.href) {
      return true;
    } else {
      var components = event.currentTarget.id.split(":");
      Router.go("/dataset/edit/" + components[1]);
      return false;
    }
  }
});

/*****************************************************************************/
/* Helpers */
/*****************************************************************************/
Template.datasets.helpers({
  searchResults: function() {
    var searchTerm = new RegExp(Session.get("nqm-search"),"gi");
    return datasets.find({ $or: [ {name: searchTerm}, {description: searchTerm }, {tags: searchTerm }]}).fetch();
  }
});

Template.datasets.onRendered(function() {
  Session.set("modalBackLocation","/datasets");
});