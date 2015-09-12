var jwt = Meteor.npmRequire("jwt-simple");
var url = Meteor.npmRequire("url");

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {fields: {nqmId: 1, email: 1} });
  } else {
    this.ready();
  }
});

Meteor.publish("widgetTypes", function() {
  return widgetTypes.find();
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
    // Return all zone connections that the user participates in (either truster or trustee).
    return zoneConnections.find({$or: [{owner: user.username},{otherEmail: nqmTBX.helpers.getUserEmail(user)}]});
  } else {
    this.ready();
  }
});

Meteor.publish("shareTokens", function(datasetId) {
  var user = Meteor.users.findOne(this.userId);
  if (user && user.username) {
    return shareTokens.find({owner: user.username, scope: datasetId});
  } else {
    this.ready();
  }
});

Meteor.publish("widgets", function() {
  return widgets.find();
});

Meteor.publish("account", function() {
  var user = Meteor.users.findOne(this.userId);
  if (user && user.username) {
    return accounts.find({id: user.username},{fields: {authId: 0}});
  }
});

Meteor.publish("hubs", function() {
  var user = Meteor.users.findOne(this.userId);
  if (user && user.username) {
    return hubs.find({ owner: user.username });
  }
});

Meteor.publish("feeds", function() {
  var user = Meteor.users.findOne(this.userId);
  if (user && user.username) {
    return feeds.find({ owner: user.username });
  }
});

Meteor.publish("datasets", function(opts) {

  // DEBUG
  this.onStop(function() {
    console.log("*** stopping datasets publication");
  });

  var user = Meteor.users.findOne(this.userId);
  if (user && user.username) {
    var account = accounts.findOne({id: user.username});

    // Sanitize dataset ids.
    if (typeof opts.id === "object") {
      var sanitized = [];
      _.each(opts.id.$in, function(id) {
        if (account.resources.hasOwnProperty(id)) {
          sanitized.push(id);
        } else {
          console.log("datasets pub - permisssion denied to access dataset %s",id);
        }
      });
      if (sanitized.length > 0) {
        opts.id.$in = sanitized;
        return datasets.find(opts);
      }
    } else {
      if (account.resources.hasOwnProperty(opts.id)) {
        return datasets.find(opts);
      }
    }
  }

  this.ready();
});

Meteor.publish("datasetList", function(opts) {
  var self = this;

  var user = Meteor.users.findOne(this.userId);
  if (user && user.username) {

    var addAccountDatasets = function(acc) {
      _.each(acc.resources, function(v,k) {
        var dataset = datasets.findOne({id: k});
        if (dataset) {
          self.added("DatasetList",dataset._id,dataset);
        } else {
          console.log("failed to load dataset %s",k);
        }
      });
    };

    var changeAccountDatasets = function(newAcc, oldAcc) {
      // Loop thru new account resources looking for ids not in oldAcc.
      _.each(newAcc.resources, function(v,k) {
        if (!oldAcc.resources.hasOwnProperty(k)) {
          // This is a new resource.
          var dataset = datasets.findOne({id: k});
          if (dataset) {
            self.added("DatasetList", dataset._id, dataset);
          }
        }
      });
      // Loop thru oldAcc
      _.each(oldAcc.resources, function(v,k) {
        if (!newAcc.resources.hasOwnProperty(k)) {
          // This resource was deleted.
          var dataset = datasets.findOne({id: k});
          if (dataset) {
            self.removed("DatasetList", dataset._id, dataset);
          }
        }
      });
    };

    var accountCursor = accounts.find({id: user.username });
    if (opts && opts.id) {
      // Single dataset subscription.
      var account = accountCursor.fetch();
      if (account.length === 1 && account[0].resources.hasOwnProperty(opts.id)) {
        return datasets.find({id: opts.id});
      }
    } else {
      var liveQuery = accountCursor.observe({
        added: function(acc) {
          addAccountDatasets(acc);
        },
        changed: function(newAcc,oldAcc) {
          console.log("account changed: %j",newAcc);
          changeAccountDatasets(newAcc, oldAcc);
        },
        removed: function(acc) {
          console.log("account removed!? - %s",acc.id);
        }
      });

      this.onStop(function() {
        liveQuery.stop();
      })
    }
  }

  this.ready();
});

Meteor.publish("feedData", function(opts) {

  // DEBUG
  this.onStop(function() {
    console.log("*** stopping feedData publication");
  });

  var user = Meteor.users.findOne(this.userId);
  if (user && user.username) {
    // TODO - proper permissioning (see datasetData)
    var lookup = {owner: user.username, hubId: opts.hubId, id: opts.id};

    // Find corresponding feed.
    var feed = feeds.findOne(lookup);
    if (feed) {
      var coll = Mongo.Collection.get(feed.store);
      if (!coll) {
        coll = new Mongo.Collection(feed.store);
      }

      lookup = {};
      if (opts.from) {
        lookup["timestamp"] = {$gt: opts.from};
      }
      opts.limit = opts.limit || 1000;

      return coll.find(lookup, {sort: {"timestamp": -1}, limit: opts.limit});
    }
  }

  this.ready();
});

Meteor.publish("datasetData", function(opts) {
  check(opts.id, String);

  // DEBUG
  this.onStop(function() {
    console.log("*** stopping datasetData publication");
  });

  var user = Meteor.users.findOne(this.userId);
  if (user && user.username) {
    // Get account.
    var accountLookup = {
      id: user.username
    };
    accountLookup["resources." + opts.id + ".access"] = "read";
    var account = accounts.findOne(accountLookup);
    if (account) {
      // Account has permission -> find corresponding dataset.
      var dataset = datasets.findOne({ id: opts.id });
      if (dataset) {
        var coll = Mongo.Collection.get(dataset.store);
        if (!coll) {
          coll = new Mongo.Collection(dataset.store);
        }

        // Todo - implement where and sort clauses.
        var lookup = {};
        var limit = opts.limit || 1000;

        var sort = {};
        sort[dataset.uniqueIndex[0].asc ? dataset.uniqueIndex[0].asc : dataset.uniqueIndex[0].desc] = 1;

        return coll.find(lookup, {sort: sort, limit: limit});
      }
    }
  }

  this.ready();
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