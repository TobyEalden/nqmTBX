/**
 * Created by toby on 10/06/15.
 */

timeSeriesBase = {};

var doVisualisationRender = function() {
  // Make sure loading screen is gone.
  $("#nqm-vis-loading-" + this.data._id).remove();

  if (this.data.collection.length > 0) {
    // Display SVG if we have data.
    // Need to use attr here as removeClass doesn't work on SVG.
    $("#" + this.data.type + "-" + this.data._id).attr("class","nqm-svg");
  } else {
    // Display 'no data' if there's none.
    $("#nqm-vis-no-data-" + this.data._id).removeClass("hide");
  }
  this._visualisation.render();
};

var debugStart = function() {
  this._debugTimer = Date.now();
};

var debugOut = function(msg) {
  if (this._debugTiming) {
    console.log(this.data.feedId + " - " + msg + " - elapsed: " + (Date.now() - this._debugTimer));
  }
};

timeSeriesBase.startSubscriptions = function() {
  var self = this;

  // Debug timing.
  debugStart.call(self);
  debugOut.call(self,"starting subscription for: " + self.data.name);

  self.data.collection = [];

  // Subscribe to data for last 24 hours.
  var sinceDate = new Date(Date.now() - 24*60*60*1000);
  var feedSub = self.subscribe("feedData", { hubId: self.data.hubId, id: self.data.feedId, from: sinceDate.getTime() });

  // Get notified when the subscription is ready.
  self.autorun(function() {
    if (feedSub.ready()) {
      debugOut.call(self,"starting data find");

      // Build the projection based on the visualisation configuration.
      var projection = {
        fields: {},
        sort: { "datum.timestamp": 1 }
      };
      projection.fields["datum." + self.data.series] = 1;
      projection.fields["datum." + self.data.datum] = 1;
      var cursor = feedData.find({ "hubId": self.data.hubId, "id": self.data.feedId}, projection);
      debugOut.call(self,"finished find");

      // Listen for changes to the collection.
      cursor.observe({
        added: function(d) {
          self.data.collection.push(d);
          doVisualisationRender.call(self);
        },
        removedAt: function(d,i) {
          self.data.collection.splice(i,1);
          doVisualisationRender.call(self);
        }
      });
      debugOut.call(self,"data loaded");

      // Perform initial render.
      doVisualisationRender.call(self);
    }
  });

  self.autorun(function() {
    if (Session.get("nqm-vis-grid-update-" + self.data._id) === true) {
      Session.set("nqm-vis-grid-update-" + self.data._id,undefined);
      self._visualisation.checkSize();
    }
  });
};
