/**
 * Created by toby on 25/08/15.
 */

nqmTBX.helpers.neverExpire = moment().year(270000).startOf("year");

Meteor.startup(function() {
  injectTapEventPlugin();
});

nqmTBX.subscribeDatasetData = function(dataset, opts) {
  var dsDataSub;

  if (dataset) {
    var coll = Mongo.Collection.get(dataset.store);
    if (!coll) {
      coll = new Mongo.Collection(dataset.store);
    }
    dsDataSub = Meteor.subscribe("datasetData", opts);
  }

  return dsDataSub;
};