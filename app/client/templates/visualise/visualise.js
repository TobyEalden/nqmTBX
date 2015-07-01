/**
 * Created by toby on 01/07/15.
 */

/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
Template.visualise.events({
  "click #nqm-visualisation-search": function(e, template) {
    var searchTerm = new RegExp(e.target.value,"gi");
    var matches = feeds.find({ name: /therm/}).fetch();
    Session.set("visualisation-search", matches);
  }
});

