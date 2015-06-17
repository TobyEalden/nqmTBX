/**
 * Created by toby on 10/06/15.
 */

Template.timeSeries.events({
  "click .nqm-close": function(event, template) {
    Meteor.call("/app/widget/remove", template.data._id, function(err,result) {
      if (err) {
        Materialize.toast("failed to remove visualisation: " + err.message,10000);
      } else {
        Materialize.toast("visualisation removed",2000);
      }
    });
  }
});

Template.timeSeries.onRendered(function() {
  var grid = $('.grid-stack').data('gridstack');
  if (grid) {
    // Get the node representing the grid-stack item.
    var gridNode = this.$("#nqm-vis-" + this.data._id);

    // If there is a position use it when adding the widget, otherwise use auto-position.
    if (this.data.position) {
      grid.add_widget(gridNode,this.data.position.x,this.data.position.y,this.data.position.w,this.data.position.h);
    } else {
      grid.add_widget(gridNode,undefined,undefined,4,2,true);
      // Now set the position to the default value given by grid-stack..
      var nodeData = $(gridNode).data();
      this.data.position = { x: nodeData.gsX, y: nodeData.gsY, w: nodeData.gsWidth, h: nodeData.gsHeight };
    }
  } else {
    // TODO - review why this happens on DDP refresh (doesn't appear to cause any problems).
    console.log("Template.timeSeries.onRendered => grid not initialised!!!");
  }

  // Initialise the drop-down menu.
  this.$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: -95, // Spacing from edge
      belowOrigin: true // Displays dropdown below the button
    }
  );
});

Template.timeSeries.onDestroyed(function() {
  var gridNode = this.$("#nqm-vis-" + this.data._id);
  var grid = $('.grid-stack').data('gridstack');
  if (grid && gridNode) {
    // Get the node representing the grid-stack item.
    grid.remove_widget(gridNode, false);
  }
});
