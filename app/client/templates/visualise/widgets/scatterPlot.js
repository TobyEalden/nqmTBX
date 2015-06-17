/**
 * Created by toby on 16/06/15.
 */

Template.scatterPlot.onCreated(function() {
  // Create the visualisation.
  this._visualisation = new NQMScatterPlot(this.data);
});

Template.scatterPlot.onRendered(function() {
  // Delegate to helper.
  timeSeriesBase.startSubscriptions.call(this);
});

Template.scatterPlot.onDestroyed(function() {
  // Delegate to helper.
  timeSeriesBase.stopSubscriptions.call(this);
});