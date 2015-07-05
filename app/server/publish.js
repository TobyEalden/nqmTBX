Meteor.publish("widgets", function() {
  return widgets.find();
});

Meteor.publish("hubs", function(opts) {
  return hubs.find();
});

Meteor.publish("feeds", function(opts) {
  return feeds.find();
});

Meteor.publish("datasets", function(opts) {
  return datasets.find();
});

Meteor.publish("widgetTypes", function() {
  return widgetTypes.find();
});

Meteor.publish("feedData", function(opts) {
  var lookup = { hubId: opts.hubId, id: opts.id };

  // Find corresponding feed.
  var feed = feeds.findOne(lookup);
  if (feed) {
    if (!feedDataCache.hasOwnProperty(feed.store)) {
      feedDataCache[feed.store] = new Mongo.Collection(feed.store);
    }
    var coll = feedDataCache[feed.store];

    lookup = {};
    if (opts.from) {
      lookup["timestamp"] = { $gt: opts.from };
    }
    opts.limit = opts.limit || 1000;

    return coll.find(lookup,{ sort: { "timestamp": -1 }, limit: opts.limit });
  }
});

var getIOTFeedPublisher = function(feedName) {
  // Create a publish handler for the given feed.
  return function(opts) {
    if (feedDataCache.hasOwnProperty(feedName)) {
      var lookup = {};
      if (opts.from) {
        lookup["timestamp"] = { $gt: opts.from };
      }
      opts.limit = opts.limit || 1000;

      return feedDataCache[feedName].find(lookup,{ sort: { "timestamp": -1 }, limit: opts.limit });
    } else {
      console.log("feed not found: %s",feedName);
      this.stop();
    }
  };
};

Meteor.publish("datasetData", function(opts) {
  var lookup = { id: opts.id };

  // Find corresponding dataset.
  var dataset = datasets.findOne(lookup);
  if (dataset) {
    if (!datasetDataCache.hasOwnProperty(dataset.store)) {
      datasetDataCache[dataset.store] = new Mongo.Collection(dataset.store);
    }
    var coll = datasetDataCache[dataset.store];

    // Todo - implement where and sort clauses.
    lookup = {};
    opts.limit = opts.limit || 1000;

    var sort = {};
    sort[dataset.uniqueIndex[0].asc ? dataset.uniqueIndex[0].asc : dataset.uniqueIndex[0].desc] = 1;

    return coll.find(lookup,{ sort: sort, limit: opts.limit });
  }
});

var getDatasetPublisher = function(datasetName) {
  // Create a publish handler for the given dataset.
  return function(opts) {
    if (datasetDataCache.hasOwnProperty(datasetName)) {
      var lookup = {};
      opts.limit = opts.limit || 1000;

      return datasetDataCache[datasetName].find(lookup,{ sort: { "timestamp": -1 }, limit: opts.limit });
    } else {
      console.log("feed not found: %s",datasetName);
      this.stop();
    }
  };
};

Meteor.startup(function() {
  // Keep publications up-to-date as new feeds are added/removed.
  feeds.find().observe({
    added: function(feed) {
      // A new feed has been added => create a publication for the feed data.
      console.log("publishing feed %s",feed.store);
      feedDataCache[feed.store] = new Mongo.Collection(feed.store);
      Meteor.publish(feed.store, getIOTFeedPublisher(feed.store));
    },
    removed: function(feed) {
      // A feed has been removed => remove from cache.
      console.log("removing feed %s", feed.store);
      delete feedDataCache[feed.store];
    }
  });
});