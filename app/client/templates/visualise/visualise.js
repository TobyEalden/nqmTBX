/*****************************************************************************/
/* Home: Event Handlers */
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
/* Home: Helpers */
/*****************************************************************************/
Template.visualise.helpers({
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.visualise.rendered = function() {
  console.log("visualise template rendered " + this.view.renderCount + " times");
  $('.tooltipped').tooltip({ delay: 50 });
};
