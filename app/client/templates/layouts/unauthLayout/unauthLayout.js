/**
 * Created by toby on 05/08/15.
 */

Template.unauthLayout.events({
});

Template.unauthLayout.onRendered(function () {
  $(".button-collapse").sideNav({
    closeOnClick: false
  });

  $('.collapsible').collapsible({
    accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
  });
});
