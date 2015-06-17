Meteor.publish("widgets", function() {
  return widgets.find();
});

Meteor.publish("feedName", function(opts) {
  return feeds.find({ evtName: "created" });
});

Meteor.publish("feedData", function(opts) {
  var lookup = {
    evtName: "feedData",
    key: { hubId: opts.hubId, id: opts.feed }
  };
  if (opts.from) {
    lookup["params.timestamp"] = { $gt: opts.from };
  }
  opts.limit = opts.limit || 1000;

  return feeds.find(lookup,{ sort: { "params.timestamp": -1 }, limit: opts.limit });
});

Meteor.publish("widgetTypes", function() {
  return widgetTypes.find();
});
