/**
 * Created by toby on 10/06/15.
 */

/*****************************************************************************/
/* Helpers */
/*****************************************************************************/
Template.grid.helpers({
  gridItem: function() {
    return _.values(Session.get(gridSessionKey));
  }
});

/*****************************************************************************/
/* Lifecycle Hooks */
/*****************************************************************************/
Template.grid.onCreated(function() {
  this._gridItems = {};
  Session.set(gridSessionKey,this._gridItems);
});

Template.grid.onRendered(function() {
  initialiseGridStack.call(this);
  this.subscribe("widgets", subscriptionReady.bind(this));
});

Template.grid.onDestroyed(function() {
  if (this._liveQuery) {
    this._liveQuery.stop();
    delete this._liveQuery;
  }
});

/*****************************************************************************/
/* Private implementation */
/*****************************************************************************/
var gridSessionKey = "gridStackItems";

var initialiseGridStack = function() {
  var self = this;

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
    if (!self._ignoreUpdates && items.length > 0) {
      self._savingTimer = setTimeout(function() {
        $('#nqm-feedback-modal').openModal();
      },250);
      saveWidgetPositions(0, items, function() {
        clearTimeout(self._savingTimer);
        $('#nqm-feedback-modal').closeModal();
      });
    }
  });

  var layout = _.debounce(onWindowResized.bind(this), 1000);
  $(window).resize(layout);
};

var onWindowResized = function() {
  console.log("layout");
  _.each(this._gridItems, function(v) {
    Session.set("nqm-vis-grid-update-" + v._id, true);
  });
};

var subscriptionReady =  function() {
  var self = this;

  // Observer for changes in collection.
  self._liveQuery = widgets.find().observe({
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
      if (!existing.position || existing.position.x != vnew.position.x || existing.position.y != vnew.position.y || existing.position.w != vnew.position.w || existing.position.h != vnew.position.h) {
        // Assign updated item.
        self._gridItems[vnew._id] = vnew;
        Session.set(gridSessionKey,self._gridItems);

        // Update the grid-stack component.
        var grid = $(".grid-stack").data("gridstack");
        var nodeElement = $("#nqm-vis-" + vnew._id);
        console.log("liveQuery - widget position changed: " + vnew._id + " " + JSON.stringify(vnew.position));
        self._ignoreUpdates = true;
        grid.update(nodeElement, vnew.position.x, vnew.position.y, vnew.position.w, vnew.position.h);
        self._ignoreUpdates = false;
        console.log("liveQuery - update complete");

        Session.set("nqm-vis-grid-update-" + vnew._id, true);
      } else {
        console.log("ignoring data update - position not changed.")
      }
    },
    removed: function(v) {
      delete self._gridItems[v._id];
      Session.set(gridSessionKey,self._gridItems);
    }
  });
};

var saveWidgetPosition = function(id, pos, cb) {
  console.log("saving widget position: " + id);
  Meteor.call("/app/widget/updatePosition",{ _id: id, position: pos}, function(err) {
    if (err) {
      console.log("failed to save widget position: " + err.message);
      cb();
    } else {
      console.log("saved widget position: " + id);
      cb();
    }
  });
};

var saveWidgetPositions = function(i, items, cb) {
  var iterate = function() {
    i++;
    if (i < items.length) {
      saveWidgetPositions(i, items, cb);
    } else if (typeof cb === "function") {
      cb();
    }
  };

  var item = items[i];
  var widgetId = item.el.data().widgetId;
  var current = widgets.findOne({_id: widgetId});
  if (!current.position || current.position.x != item.x || current.position.y != item.y || current.position.w != item.width || current.position.h != item.height) {
    saveWidgetPosition(widgetId,{ x: item.x, y: item.y, w: item.width, h: item.height }, iterate);
  } else {
    console.log("not saving " + widgetId + " position unchanged");
    iterate();
  }
};
