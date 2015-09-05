/**
 * Created by toby on 10/06/15.
 */

window.NQMScatterPlot = (function() {
  // Constructor
  function ScatterPlot(ctrl) {
    SeriesBase.call(this, ctrl);
  }

  ScatterPlot.prototype = Object.create(SeriesBase.prototype);
  ScatterPlot.prototype.constructor = ScatterPlot;

  ScatterPlot.prototype.onRender = function(renderGroup) {
    var self = this;
    var updateSelection = renderGroup.selectAll("circle").data(this._ctrl.props.config.collection, this._xValue);

    updateSelection
      .enter()
      .append("circle")
      .attr("r",1)
      .attr("fill",function(d) { return self._colour(d[self._ctrl.props.config.datum]); });

    updateSelection
      .transition()
      .duration(1000)
      .attr("cx", self._xMap)
      .attr("cy", self._yMap);

    updateSelection
      .exit()
      .remove();
  };

  return ScatterPlot;
}());
