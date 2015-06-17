/**
 * Created by toby on 10/06/15.
 */

var gridSessionKey = "gridStackItems";

Template.grid.onCreated(function() {
  this._gridItems = {};
  Session.set(gridSessionKey,this._gridItems);
});

Template.grid.helpers({
  gridItem: function() {
    return _.values(Session.get(gridSessionKey));
  }
});

Template.grid.rendered = function() {
  initialiseGridStack();
  this._subscription = Meteor.subscribe("widgets", subscriptionReady.bind(this));
};

Template.grid.onDestroyed(function() {
  if (this._subscription) {
    this._subscription.stop();
  }
});

var initialiseGridStack = function() {
  // Initialise grid-stack.
  var options = {
    auto: true,
    float: false,
    cell_height: 80,
    vertical_margin: 20,
    resizable: {
      handles: 'e, se, s, sw, w'
    },
    always_show_resize_handle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  };
  $(".grid-stack").gridstack(options);
  $(".grid-stack").on("change", function(e,items) {
    visualisationCache.update(items);
  });
};

var subscriptionReady =  function() {
  var self = this;

  // Get cursor for visualisations.
  self._cursor = widgets.find();

  // Observer for changes in collection.
  self._cursor.observe({
    added: function(v) {
      if (!self._gridItems.hasOwnProperty(v._id)) {
        self._gridItems[v._id] = v;
        Session.set(gridSessionKey,self._gridItems);
      } else {
        console.log("duplicate in collection???");
      }
    },
    changed: function(vnew, vold) {
      // Avoid circular updates - has position actually changed?
      var existing = self._gridItems[vnew._id];
      if (!existing.position || existing.position.x !== vnew.position.x || existing.position.y !== vnew.position.y || existing.position.w !== vnew.position.w || existing.position.h !== vnew.position.h) {
        // Assign updated item.
        self._gridItems[vnew._id] = vnew;
        Session.set(gridSessionKey,self._gridItems);

        // Update the grid-stack component.
        var visualInfo = visualisationCache.find(vnew._id);
        var grid = $('.grid-stack').data('gridstack');
        grid.update(visualInfo.nodeElement, vnew.position.x, vnew.position.y, vnew.position.w, vnew.position.h);

        // Let the current event complte and then update the UI.
        Meteor.setTimeout(function() {
          visualInfo._visualisation.checkSize();
        },0);
      }
    },
    removed: function(v) {
      delete self._gridItems[v._id];
      Session.set(gridSessionKey,self._gridItems);
    }
  });
};
