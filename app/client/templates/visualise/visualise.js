
/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
Template.visualise.events({
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
Template.visualise.helpers({
});

/*****************************************************************************/
/* Lifecycle Hooks */
/*****************************************************************************/
Template.visualise.onRendered(function() {
  // Initialise tooltips.
  $(".tooltipped").tooltip({ delay: 50 });
});
