Template.mainLayout.helpers({
});

Template.mainLayout.events({
});

Template.mainLayout.onRendered(function() {
  $(".button-collapse").sideNav({
    closeOnClick: true
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
});

