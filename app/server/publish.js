Meteor.publish("widgets", function() {
  return widgets.find();
});

Meteor.publish("feeds", function(opts) {
  return feeds.find();
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

Meteor.publish("widgetTypes", function() {
  return widgetTypes.find();
});

var getIOTFeedPublisher = function(feedName) {
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

Meteor.startup(function() {
  feeds.find().observe({
    added: function(feed) {
      console.log("publishing feed %s",feed.store);
      feedDataCache[feed.store] = new Mongo.Collection(feed.store);
      Meteor.publish(feed.store, getIOTFeedPublisher(feed.store));
    },
    removed: function(feed) {
      console.log("removing feed %s", feed.store);
      delete feedDataCache[feed.store];
    }
  });
});