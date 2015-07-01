/**
 * Created by toby on 16/06/15.
 */

Template.lineChart.onCreated(function() {
  // Create the visualisation.
  this._visualisation = new NQMLineChart(this.data);
  this._debugTiming = false;
});

Template.lineChart.onRendered(function() {
  // Delegate to helper.
  timeSeriesBase.startSubscriptions.call(this);
});
