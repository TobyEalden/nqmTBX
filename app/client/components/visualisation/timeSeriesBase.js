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

timeSeriesBase.destroy = function() {
  console.log("timeSeriesBase.destroy");
  if (this._liveQuery) {
    this._liveQuery.stop();
    delete this._liveQuery;
  }
};

timeSeriesBase.startSubscriptions = function() {
  var self = this;
  self.props.config.collection = [];

  // Debug timing.
  debugStart.call(self);
  debugOut.call(self,"starting subscription for: " + self.props.config.name);

  var dsSub = Meteor.subscribe("datasets", {id:self.props.config.feedId}, function() {
    var feed = datasets.findOne({ id: self.props.config.feedId });
    if (feed) {
      self.setState({gotDataset: true});
      var collection = Mongo.Collection.get(feed.store);
      if (!collection) {
        collection = new Mongo.Collection(feed.store);
      }
    
      // Subscribe to data for last 24 hours.
      var sinceDate = new Date(Date.now() - 24*60*60*1000);

      var opts = {
        limit: 10000,
        id: feed.id,
        from: {timestamp: {$gt: sinceDate.getTime()}}
      };
      var feedSub = Meteor.subscribe("datasetData", opts);

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
          var cursor = collection.find({}, projection);
          debugOut.call(self,"finished find");

          // Listen for changes to the collection.
          self._liveQuery = cursor.observe({
            added: function(d) {
              self.props.config.collection.push(d);
              self.setState({gotData: true});
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
        if (Session.get("nqm-vis-grid-update-" + self.props.config.id) === true) {
          Session.set("nqm-vis-grid-update-" + self.props.config.id,undefined);
          if (self._visualisation) {
            self._visualisation.checkSize();
          }
        }
      });
    } else {
      // Failed to find/load/access dataset.

    }
  });
  return dsSub;
};
