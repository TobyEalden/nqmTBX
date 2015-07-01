/**
 * Created by toby on 16/06/15.
 */

Template.scatterPlot.onCreated(function() {
  // Create the visualisation.
  this._visualisation = new NQMScatterPlot(this.data);
  this._debugTiming = false;
});

Template.scatterPlot.onRendered(function() {
  // Delegate to helper.
  timeSeriesBase.startSubscriptions.call(this);
});

