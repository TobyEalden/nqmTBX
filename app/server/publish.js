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

Meteor.publish("datasets", function(opts) {
  opts = opts || {};

  // DEBUG
  this.onStop(function() {
    console.log("*** stopping datasets publication");
  });

  var user = Meteor.users.findOne(this.userId);
  if (user && user.username) {
    var account = accounts.findOne({id: user.username});

    if (!opts.id) {
      opts.id = {$in: _.map(account.resources, function(v,k) { return k; })};
    }

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

Meteor.publish("datasetData", function(opts) {
  check(opts.id, String);

  // DEBUG
  this.onStop(function() {
    console.log("*** stopping datasetData publication");
  });

  var user = Meteor.users.findOne(this.userId);
  if (user && user.username) {
    // Get account.
    var resourceLookup = "resources." + opts.id + ".access";
    var accountLookup = {
      id: user.username
    };
    accountLookup[resourceLookup] = {$in: ["read","write"]};
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
        var lookup = opts.from || {};
        var limit = opts.limit || 1000;

        var sort = {};
        if (opts.sort) {
          sort = opts.sort;
        } else if (dataset.uniqueIndex && dataset.uniqueIndex.length > 0) {
          sort[dataset.uniqueIndex[0].asc ? dataset.uniqueIndex[0].asc : dataset.uniqueIndex[0].desc] = 1;          
        }

        return coll.find(lookup, {sort: sort, limit: limit});
      }
    }
  }

  this.ready();
});

Meteor.publish("visualisations", function(opts) {

  // DEBUG
  this.onStop(function() {
    console.log("*** stopping visualisations publication");
  });

  var user = Meteor.users.findOne(this.userId);
  if (user && user.username) {
    var account = accounts.findOne({id: user.username});

    // Sanitize resource ids.
    if (typeof opts.id === "object") {
      var sanitized = [];
      _.each(opts.id.$in, function(id) {
        if (account.resources.hasOwnProperty(id)) {
          sanitized.push(id);
        } else {
          console.log("visualisations pub - permisssion denied to access resource%s",id);
        }
      });
      if (sanitized.length > 0) {
        opts.id.$in = sanitized;
        return visualisations.find(opts);
      }
    } else {
      if (account.resources.hasOwnProperty(opts.id)) {
        return visualisations.find(opts);
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