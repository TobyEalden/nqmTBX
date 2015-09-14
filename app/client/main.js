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

  /****************************************************************************
  * This tracker handles API token creation for the share authentication route.
  *
  * It fires when the logged in user changes.
  *
  * If the current route is the share authentication page we know that a user
  * has just logged in requesting access to a resource.
  *
  * A parameter of the share authentication route is an authentication JWT 
  * issued by the REST API contain details of the zone requesting access.
  * 
  ****************************************************************************/
  Tracker.autorun(function() {
    var router = FlowRouter.current();

    // Check if the current route is the share authentication page.
    if (router && router.route && router.route.name === "shareAuth") {
      if (!Meteor.loggingIn() && Meteor.user()) {
        // A user has just authenticated to request sharing.
        console.log("share authentication: " + Meteor.user().username);

        // Attempt to create api access token for this user.
        Meteor.call("/api/token/create", router.params.jwt, function (err, result) {
          if (err) {
            console.log("failed to create API token: " + err.message);
            FlowRouter.go("error",{statusCode: 401 });
          } else {
            if (result.ok && result.token) {
              // Received an api token => redirect to return url.
              var urlParser = new URI(router.queryParams.rurl);
              // Set the token as a query parameter.
              urlParser.setSearch("t", result.token);
              // Point browser at return url.
              window.location.replace(urlParser.toString());
            } else {
              // No api token => redirect to request access page.
              FlowRouter.go("requestAccess",{ jwt: router.params.jwt });
            }
          }
        });
      } else {
        // Route is share authentication, but user isn't logged in.
        // Do nothing.
      }
    } else {
      // Current route is not share authentication.
      // Do nothing.
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
    }
  });

  Meteor.subscribe("widgetTypes");
  Meteor.subscribe("userData");
});