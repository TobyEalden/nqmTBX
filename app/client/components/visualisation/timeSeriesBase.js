/**
 * Created by toby on 10/06/15.
 */

timeSeriesBase = {};

var doVisualisationRender = function() {
  // Make sure loading screen is gone.
//  $("#nqm-vis-loading-" + this.data._id).remove();

  //if (this.data.collection.length > 0) {
  //  // Display SVG if we have data.
  //  // Need to use attr here as removeClass doesn't work on SVG.
  //  $("#" + this.props.config.type + "-" + this.props.config._id).attr("class","nqm-svg");
  //} else {
  //  // Display 'no data' if there's none.
  //  $("#nqm-vis-no-data-" + this.data._id).removeClass("hide");
  //}
  var self = this;
  setTimeout(function() {
    self._visualisation.render();
  },0);
};

var debugStart = function() {
  this._debugTimer = Date.now();
};

var debugOut = function(msg) {
  if (this._debugTiming) {
    console.log(this.props.config.feedId + " - " + msg + " - elapsed: " + (Date.now() - this._debugTimer));
  }
};

timeSeriesBase.startSubscriptions = function() {
  var self = this;
  var feedSub;
  self.props.config.collection = [];

  // Debug timing.
  debugStart.call(self);
  debugOut.call(self,"starting subscription for: " + self.props.config.name);

  var feed = feeds.findOne({hubId: self.props.config.hubId, id: self.props.config.feedId });
  if (feed) {
    // Subscribe to data for last 24 hours.
    var sinceDate = new Date(Date.now() - 24*60*60*1000);
//  feedSub = Meteor.subscribe(feed.store, { from: sinceDate.getTime() });
    feedSub = Meteor.subscribe(feed.store);

    // Get notified when the subscription is ready.
    Tracker.autorun(function() {
      if (feedSub.ready()) {
        debugOut.call(self,"starting data find");

        // Build the projection based on the visualisation configuration.
        var projection = {
          fields: {},
          sort: { "timestamp": 1 }
        };
        projection.fields[self.props.config.series] = 1;
        projection.fields[self.props.config.datum] = 1;
        var cursor = feedDataCache[feed.store].find({}, projection);
        debugOut.call(self,"finished find");

        // Listen for changes to the collection.
        cursor.observe({
          added: function(d) {
            self.props.config.collection.push(d);
            doVisualisationRender.call(self);
          },
          removedAt: function(d,i) {
            self.props.config.collection.splice(i,1);
            doVisualisationRender.call(self);
          }
        });
        debugOut.call(self,"data loaded");

        // Perform initial render.
        doVisualisationRender.call(self);
      }
    });

    Tracker.autorun(function() {
      if (Session.get("nqm-vis-grid-update-" + self.props.config._id) === true) {
        Session.set("nqm-vis-grid-update-" + self.props.config._id,undefined);
        self._visualisation.checkSize();
      }
    });
  } else {
    // Failed to load dataset.
  }

  return feedSub;
};
