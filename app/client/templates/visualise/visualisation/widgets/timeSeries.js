/**
 * Created by toby on 10/06/15.
 */

/*****************************************************************************/
/* Event Handlers */
/*****************************************************************************/
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

/*****************************************************************************/
/* Lifecycle Hooks */
/*****************************************************************************/
Template.timeSeries.onRendered(function() {
  var grid = $('.grid-stack').data('gridstack');

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

  // Initialise the drop-down menu.
  this.$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: -80, // Spacing from edge
      belowOrigin: true // Displays dropdown below the button
    }
  );
});

Template.timeSeries.onDestroyed(function() {
  var gridNode = this.$("#nqm-vis-" + this.data._id);
  var grid = $('.grid-stack').data('gridstack');
  if (grid && gridNode && gridNode.data('_gridstack_node')) {
    // Get the node representing the grid-stack item.
    grid.remove_widget(gridNode, false);
  }
});
