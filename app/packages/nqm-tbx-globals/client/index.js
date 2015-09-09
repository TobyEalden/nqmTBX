nqmTBX.ui = {};

nqmTBX.ui.notification = function(msg, delay) {
  var notificationQ = Session.get("nqm-ui-notification") || [];
  notificationQ.push({
    msg: msg,
    delay: delay || 2000
  });
  Session.set("nqm-ui-notification",notificationQ);

  if (!Session.get("nqm-ui-notification-showing")) {
    Session.set("nqm-ui-notification-showing",true);
  }

  return console.log(msg);
};

// Visualisation namespace.
nqmTBX.vis = {};

// Authentication namespace.
nqmTBX.auth = {};

// Pages namespace.
nqmTBX.pages = {};

if (!nqmTBX.helpers) {
  nqmTBX.helpers = {};
}

nqmTBX.helpers.logout = function() {
  Meteor.logout();
  FlowRouter.go("/");
};

nqmTBX.helpers.methodCallback = function(code) {
  return function(err, result) {
    if (err) {
      nqmTBX.ui.notification(code + " failed: " + err.message);
    }
    if (result && result.ok) {
      nqmTBX.ui.notification(code + " command sent, " + result.result.id);
    }
  };
};
