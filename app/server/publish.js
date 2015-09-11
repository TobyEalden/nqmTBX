var jwt = Meteor.npmRequire("jwt-simple");
var url = Meteor.npmRequire("url");

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {fields: {nqmId: 1, email: 1} });
  } else {
    this.ready();
  }
});

// TODO - retire, use /app/token/lookup method.
Meteor.publish("jwt", function(tokenString) {
  if (this.userId) {
    try {
      var token = jwt.decode(tokenString, Meteor.settings.APIKey);
      this.added("JWTokens", tokenString, token);
    } catch (e) {
      console.log("failed to decode token: " + tokenString);
    }
    this.ready();
  } else {
    this.ready();
  }
});

Meteor.publish("zoneConnections", function(opts) {
  var user = Meteor.users.findOne(this.userId);
  if (user && user.username) {
    return zoneConnections.find({$or: [{owner: user.username},{otherEmail: nqmTBX.helpers.getUserEmail(user)}]});
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
    return accounts.find({id: user.nqmId},{fields: {resources:0, authId: 0}});
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
  if (user && user.username) {
    if (opts && opts.id) {
      // Requested specific dataset only.
      return datasets.find({owner: user.username, id: opts.id});
    } else {
      // Request all datasets.
      var account = accounts.findOne({id: user.username });
      var datasetIds = [];
      _.each(account.resources, function(v,k) {
        datasetIds.push(k);
      });

      // TODO - remove owner:user.username clause -> not needed
      return datasets.find({$or: [{owner: user.username},{ id: {$in: datasetIds}}]});
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
    var coll = Mongo.Collection.get(feed.store);
    if (!coll) {
      coll = new Mongo.Collection(feed.store);
    }

    lookup = {};
    if (opts.from) {
      lookup["timestamp"] = { $gt: opts.from };
    }
    opts.limit = opts.limit || 1000;

    return coll.find(lookup,{ sort: { "timestamp": -1 }, limit: opts.limit });
  } else {
    this.ready();
  }
});

Meteor.publish("datasetData", function(opts) {
  var lookup = { id: opts.id };

  // Find corresponding dataset.
  var dataset = datasets.findOne(lookup);
  if (dataset) {
    var coll = Mongo.Collection.get(dataset.store);
    if (!coll) {
      coll = new Mongo.Collection(dataset.store);
    }

    // Todo - implement where and sort clauses.
    lookup = {};
    opts.limit = opts.limit || 1000;

    var sort = {};
    sort[dataset.uniqueIndex[0].asc ? dataset.uniqueIndex[0].asc : dataset.uniqueIndex[0].desc] = 1;

    return coll.find(lookup,{ sort: sort, limit: opts.limit });
  } else {
    this.ready();
  }
});

var addWidgetTypes = function() {
  if (widgetTypes.find().count() === 0) {
    widgetTypes.insert({ name: "ScatterPlot", caption: "scatter plot" });
    widgetTypes.insert({ name: "LineChart", caption: "line chart" });
  }
};

Meteor.startup(function() {
  // Add widget types if necessary.
  addWidgetTypes();
});