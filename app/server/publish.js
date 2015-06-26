Meteor.publish("widgets", function() {
  return widgets.find();
});

Meteor.publish("feeds", function(opts) {
  return feeds.find();
});

Meteor.publish("feedData", function(opts) {
  var lookup = { hubId: opts.hubId, id: opts.id };
  if (opts.from) {
    lookup["datum.timestamp"] = { $gt: opts.from };
  }
  opts.limit = opts.limit || 1000;

  return feedData.find(lookup,{ sort: { "datum.timestamp": -1 }, limit: opts.limit });
});

Meteor.publish("widgetTypes", function() {
  return widgetTypes.find();
});
