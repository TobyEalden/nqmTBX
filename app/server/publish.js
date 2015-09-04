Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {fields: {'nqmId': 1} });
  } else {
    this.ready();
  }
});

Meteor.publish("trustedUsers", function(opts) {
  var user = Meteor.users.findOne(this.userId);
  if (user && user.nqmId) {
    return trustedUsers.find({owner: user.nqmId, userId: {$ne: getUserEmail(user) }});
  } else {
    this.ready();
  }
});

Meteor.publish("shareTokens", function(datasetId) {
  var user = Meteor.users.findOne(this.userId);
  if (user && user.nqmId) {
    return shareTokens.find({owner: user.nqmId, scope: datasetId});
  } else {
    this.ready();
  }
});

Meteor.publish("widgets", function() {
  return widgets.find();
});

Meteor.publish("account", function(opts) {
  var user = Meteor.users.findOne(this.userId);
  if (user && user.nqmId) {
    return accounts.find({id: user.nqmId});
  }
});

Meteor.publish("hubs", function(opts) {
  var user = Meteor.users.findOne(this.userId);
  if (user && user.nqmId) {
    return hubs.find({ owner: user.nqmId });
  }
});

Meteor.publish("feeds", function(opts) {
  var user = Meteor.users.findOne(this.userId);
  if (user && user.nqmId) {
    return feeds.find({ owner: user.nqmId });
  }
});

Meteor.publish("datasets", function(opts) {
  var user = Meteor.users.findOne(this.userId);
  if (user && user.nqmId) {
    if (opts && opts.id) {
      // Requested specific dataset only.
      return datasets.find({owner: user.nqmId, id: opts.id});
    } else {
      // Request all datasets.
      // TODO - implement filters?
      var shared = []; //["dataset-JDBLuT","ds001"];
      return datasets.find({$or: [{ owner: user.nqmId },{ id: { $in: shared }}]});
    }
  }
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

var addWidgetTypes = function() {
  if (widgetTypes.find().count() === 0) {
    widgetTypes.insert({ name: "scatterPlot", caption: "scatter plot" });
    widgetTypes.insert({ name: "lineChart", caption: "line chart" });
  }
};

Meteor.startup(function() {
  // Add widget types if necessary.
  addWidgetTypes();

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

  datasets.find().observe({
    added: function(ds) {
      console.log("publishing dataset %s", ds.store);
      datasetDataCache[ds.store] = new Mongo.Collection(ds.store);
      Meteor.publish(ds.store, getDatasetPublisher(ds.store));
    },
    removed: function(ds) {
      console.log("removing dataset %s", ds.store);
      delete datasetDataCache[ds.store];
    }
  });
});