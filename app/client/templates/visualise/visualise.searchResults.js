/**
 * Created by toby on 01/07/15.
 */

/*****************************************************************************/
/* Helpers */
/*****************************************************************************/
Template.visualiseSearchResults.helpers({
  visualisationResults: function() {
    return Session.get("visualisation-search");
  }
});