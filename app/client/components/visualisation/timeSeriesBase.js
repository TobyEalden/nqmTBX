/**
 * Created by toby on 10/06/15.
 */

/******************************
 * TODO - implement as a mixin
 ******************************/

timeSeriesBase = {};

var doVisualisationRender = function() {
  var self = this;

  // Timeout is necessary to ensure the React component has finished loading event loop.
  setTimeout(function() { if (self._visualisation) { self._visualisation.render(); } },0);
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
    feedSub = Meteor.subscribe("feedData",{hubId: feed.hubId, id: feed.id});

    // Get notified when the subscription is ready.
    Tracker.autorun(function() {
      if (feedSub.ready()) {
        var collection = Mongo.Collection.get(feed.store);
        if (collection) {
          debugOut.call(self,"starting data find");

          // Build the projection based on the visualisation configuration.
          var projection = {
            fields: {},
            sort: { "timestamp": 1 }
          };
          projection.fields[self.props.config.series] = 1;
          projection.fields[self.props.config.datum] = 1;
          var cursor = collection.find({}, projection);
          debugOut.call(self,"finished find");

          // Listen for changes to the collection.
          var liveQuery = cursor.observe({
            added: function(d) {
              self.props.config.collection.push(d);
              doVisualisationRender.call(self);
            },
            removedAt: function(d,i) {
              self.props.config.collection.splice(i,1);
              doVisualisationRender.call(self);
            }
          });

          // TODO - when to call this? Hook into componentWillUnmount?
          // self.onStop(function() {
          //   liveQuery.stop();
          // });

          debugOut.call(self,"data loaded");

          // Perform initial render.
          doVisualisationRender.call(self);
        } else {
          console.log("data collection not found for feed: " + feed.name);
        }
      }
    });

    Tracker.autorun(function() {
      if (Session.get("nqm-vis-grid-update-" + self.props.config._id) === true) {
        Session.set("nqm-vis-grid-update-" + self.props.config._id,undefined);
        if (self._visualisation) {
          self._visualisation.checkSize();
        }
      }
    });
  } else {
    // Failed to find/load/access dataset.
  }

  return feedSub;
};
