/******************************************************************************
 * global template helpers.
 *****************************************************************************/
Template.registerHelper("queryURL", function() {
  return Meteor.settings.public.queryURL;
});

/******************************************************************************
 * app-wide subscriptions.
 *****************************************************************************/
Meteor.startup(function() {

  // Helper/diagnostic function to notify when new data arrives.
  var notifyData = function(startingUp, msg) {
    if (true || !startingUp) {
      nqmTBX.ui.notification(msg,500);
    }
  };

  Tracker.autorun(function() {
    var router = FlowRouter.current();

    // Check if the current route is the share authentication page.
    if (router && router.route && router.route.name === "shareAuth") {
      if (!Meteor.loggingIn() && Meteor.user()) {
        // A user has just authenticated to request sharing.
        console.log("share authentication: " + Meteor.user().username);

        // Create api access token for this user.
        Meteor.call("/api/token/create", router.params.jwt, function (err, result) {
          if (!result.ok) {
            console.log("failed to create API token: " + result.error);
            var errorURL = FlowRouter.path("error",{statusCode: 401 });
            FlowRouter.go(errorURL);
          } else {
            if (result.token) {
              // Received an api token => redirect to return url.
              var urlParser = new URI(router.queryParams.rurl);
              urlParser.setSearch("t", result.token);
              window.location.replace(urlParser.toString());
              //setTimeout(function () {
              //}, 30000);
            } else {
              // No api token => redirect to request access
              var requestURL = FlowRouter.path("requestAccess",{jwt: router.params.jwt });
              FlowRouter.go(requestURL);
            }
          }
        });
      }
    }
  });

  Tracker.autorun(function() {
    if (Meteor.user() && Meteor.user().nqmId) {
      // A valid nqm account is logged in.

      // Subscribe to the logged-in account.
      Meteor.subscribe("account", function() {
        var account = accounts.findOne({});
        if (account) {
          nqmTBX.ui.notification("account is " + account.id,500);
        } else {
          nqmTBX.ui.notification("no account");
        }
      });

      // Notify when new zone connections are made.
      Meteor.subscribe("zoneConnections", function() {
        zoneConnections.find({}).observe({
          added: function(zone) {
            if (zone.status !== "trusted" && zone.otherEmail === Meteor.user().email) {
              nqmTBX.ui.notification("zone connection request from - " + zone.ownerEmail,10000);
            }
          },
          changed: function(zone) {
            if (zone.owner === Meteor.user().username) {
              nqmTBX.ui.notification("zone connection " + zone.otherEmail + " is now " + zone.status,10000);
            }
          },
          removed: function(zone) {
            if (zone.owner === Meteor.user().username) {
              nqmTBX.ui.notification("zone connection " + zone.ownerEmail + " removed",10000);
            } else {
              nqmTBX.ui.notification("zone connection " + zone.otherEmail + " removed",10000);
            }
          }
        });
      });

      //
      // THE FOLLOWING ARE FOR DEBUG ONLY
      //
      // All subscriptions should be at component level
      //

      // Subscribe to the IOT hubs for this user.
      Meteor.subscribe("hubs", function() {
        var startingUp = true;

        // Observe the collection - just so we can notify when changes occur.
        hubs.find().observe({
          added: function(hub) {
            console.log("adding hub %s", hub.id);
            notifyData(startingUp, "new hub - " + hub.name);
          },
          changed: function(hub) {
            console.log("updated hub %s", hub.id);
            notifyData(startingUp, "hub update - " + hub.name);
          },
          removed: function(hub) {
            console.log("removing hub %s", hub.id);
            notifyData(startingUp, "removed hub - " + hub.name);
          }
        });

        startingUp = false;
      });

      // Subscribe to feeds for this user.
      Meteor.subscribe("feeds", function() {
        var startingUp = true;

        feeds.find().observe({
          added: function(feed) {
            console.log("adding feed %s", feed.store);
            notifyData(startingUp, "new feed - " + feed.name);
            var coll = Mongo.Collection.get(feed.store);
            if (!coll) {
              coll = new Mongo.Collection(feed.store);
            }
          },
          changed: function(feed) {
            console.log("updated feed %s", feed.store);
            notifyData(startingUp, "feed update - " + feed.name);
          },
          removed: function(feed) {
            console.log("removing feed %s", feed.store);
            notifyData(startingUp, "removed feed - " + feed.name);
          }
        });

        startingUp = false;
      });

      Meteor.subscribe("datasets", function() {
        var startingUp = true;

        datasets.find().observe({
          added: function(dataset) {
            console.log("adding dataset %s", dataset.store);
            notifyData(startingUp, "loading dataset - " + dataset.name);
            var coll = Mongo.Collection.get(dataset.store);
            if (!coll) {
              coll = new Mongo.Collection(dataset.store);
            }
          },
          changed: function(dataset) {
            console.log("updated dataset %s", dataset.store);
            notifyData(startingUp, "dataset update - " + dataset.name);
          },
          removed: function(dataset) {
            console.log("removing dataset %s", dataset.store);
            notifyData(startingUp, "removed dataset - " + dataset.name);
          }
        });

        startingUp = false;
      });
    }
  });

  Meteor.subscribe("widgetTypes");
  Meteor.subscribe("userData");
});