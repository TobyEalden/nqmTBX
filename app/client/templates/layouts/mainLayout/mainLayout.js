Template.mainLayout.helpers({
});

Template.mainLayout.events({
});

Template.mainLayout.onRendered(function() {
  $(".button-collapse").sideNav({
    closeOnClick: false
  });

  $('.nqm-user-menu-dropdown').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: true, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true // Displays dropdown below the button
    }
  );

  $('.collapsible').collapsible({
    accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
  });

});

