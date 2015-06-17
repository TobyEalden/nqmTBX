/**
 * Created by toby on 10/06/15.
 */

timeSeriesBase = {};

var doVisualisationRender = function() {
  var cfg = this.data;
  var vis = this._visualisation;

  // Make sure loading screen is gone.
  $("#nqm-vis-loading-" + cfg._id).remove();

  if (cfg.collection.length > 0) {
    // Display SVG if we have data.
    // Need to use attr here as removeClass doesn't work on SVG.
    $("#" + cfg.type + "-" + cfg._id).attr("class","nqm-svg");
  } else {
    // Display 'no data' if there's none.
    $("#nqm-vis-no-data-" + cfg._id).removeClass("nqm-not-visible");
  }
  vis.render();
};

timeSeriesBase.startSubscriptions = function() {
  var cfg = this.data;
  var vis = this._visualisation;
  var self = this;

  // Debug timing.
  var timer = Date.now();
  console.log("starting subscription for: " + cfg.name + " at " + (Date.now() - timer));

  cfg.collection = [];

  // Subscribe to data for last 24 hours.
  var sinceDate = new Date(Date.now() - 24*60*60*1000);
  this._subscription = Meteor.subscribe("feedData", { hubId: cfg.hubId, feed: cfg.feedName, from: sinceDate.getTime() });

  // Get notified when the subscription is ready.
  this._watchdog = Tracker.autorun(function() {
    if (self._subscription.ready()) {
      console.log(cfg.feedName + " starting data find: " + (Date.now() - timer));

      // Build the projection based on the visualisation configuration.
      var projection = {
        fields: {},
        sort: { "params.timestamp": 1 }
      };
      projection.fields["params." + cfg.series] = 1;
      projection.fields["params." + cfg.datum] = 1;
      var cursor = feeds.find({ evtName: "feedData", "key.id": cfg.feedName}, projection);
      console.log(cfg.feedName + " finished find: " + (Date.now() - timer));

      // Listen for changes to the collection.
      cursor.observe({
        added: function(d) {
          cfg.collection.push(d);
          doVisualisationRender.call(self);
        },
        removedAt: function(d,i) {
          console.log("removing at: " + i);
          cfg.collection.splice(i,1);
          doVisualisationRender.call(self);
        }
      });
      console.log(cfg.feedName + " data loaded: " + (Date.now() - timer));

      // Assign callback for position change notifications from grid-stack.
      self.widgetPositionChanged = timeSeriesBase.widgetPositionChanged;
      // Register with global cache (manages gridstack).
      visualisationCache.add(cfg._id, self);

      // Perform initial render.
      doVisualisationRender.call(self);
    }
  });
};

timeSeriesBase.stopSubscriptions = function() {
  console.log("stopping subscription for: " + this.data.name);
  if (this._watchdog) {
    this._watchdog.stop();
    delete this._watchdog;
  }
  if (this._subscription) {
    this._subscription.stop();
    delete this._subscription;
  }
  visualisationCache.remove(this.data._id);
};

timeSeriesBase.widgetPositionChanged = function(x,y,w,h) {
  // Only save the position if it has changed.
  if (!this.data.position || this.data.position.x !== x || this.data.position.y !== y || this.data.position.w !== w || this.data.position.h !== h) {
    // Store new position and then notify server.
    this.data.position = { x: x, y: y, w: w, h: h };
    Meteor.call("/app/widget/updatePosition", { _id: this.data._id, position: this.data.position}, function(err, result) {
      if (err) {
        console.log("failed to save widget position: " + err.message);
      }
    });
  }
};