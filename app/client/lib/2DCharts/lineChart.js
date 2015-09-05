/**
 * Created by toby on 12/06/15.
 */

window.NQMLineChart = (function() {
  // Constructor
  function LineChart(cfg) {
    SeriesBase.call(this, cfg);
  }

  LineChart.prototype = Object.create(SeriesBase.prototype);
  LineChart.prototype.constructor = LineChart;

  LineChart.prototype.onInitialise = function() {
    this._line = d3.svg.line()
      .x(this._xMap)
      .y(this._yMap)
      .interpolate("basis");
  };

  LineChart.prototype.onRender = function(renderGroup) {
    var sel = renderGroup.selectAll("path").data([0]);

    sel.enter()
      .append("path")
      .attr("class","line");

    sel
      .transition()
      .duration(1000)
      .attr("d",this._line(this._config.collection));

    sel.exit().remove();
  };

  return LineChart;
}());
