

nqmTBX.vis.scatterPlot = React.createClass({
  mixins: [ReactMeteorData],
  displayName: "nqmTBX.vis.scatterPlot",
  propTypes: {
    grid: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired
  },
  getMeteorData: function() {
    var feedSub = timeSeriesBase.startSubscriptions.call(this);

    var data = {
      ready: feedSub.ready,
    };
    return data;
  },
  componentDidMount: function() {
    // Create the visualisation.
    this._visualisation = new NQMScatterPlot(this.props.config,this);
    this._debugTiming = true;
  },
  render: function() {
    return (
      <svg id={"scatterPlot-" + this.props.config._id} className="nqm-svg"></svg>
    );
  }
});

