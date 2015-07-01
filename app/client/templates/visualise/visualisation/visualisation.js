
/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
Template.visualisation.events({
  "click #nqm-theme-change-btn": function(event, template) {
    var themes = Object.keys(Session.get("themes"));
    var current = themes.indexOf(Session.get("theme"));
    current++;
    if (current == themes.length) {
      current = 0;
    }
    Session.set("theme",themes[current]);
    Materialize.toast(themes[current],2000);
  }
});

/*****************************************************************************/
/* Helpers */
/*****************************************************************************/
Template.visualisation.helpers({
});

/*****************************************************************************/
/* Lifecycle Hooks */
/*****************************************************************************/
Template.visualisation.onRendered(function() {
  // Initialise tooltips.
  $(".tooltipped").tooltip({ delay: 50 });
});
