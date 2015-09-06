
nqmTBX.vis.ScatterPlot = React.createClass({
  mixins: [ReactMeteorData],
  displayName: "nqmTBX.vis.ScatterPlot",
  propTypes: {
    config: React.PropTypes.object.isRequired
  },
  getMeteorData: function() {
    var feedSub = timeSeriesBase.startSubscriptions.call(this);

    var data = {
      ready: feedSub && feedSub.ready()
    };
    return data;
  },
  componentDidMount: function() {
    // Create the visualisation.
    this._visualisation = new NQMScatterPlot(this);
    this._debugTiming = true;
  },
  shouldComponentUpdate: function() {
    if (this.data.ready) {
      this._visualisation.checkSize();
      return false;
    } else {
      return true;
    }
  },
  render: function() {
    var content;
    if (this.data.ready) {
      content = <svg id={"ScatterPlot-" + this.props.config._id} className="nqm-svg"></svg>;
    } else {
      content = <mui.CircularProgress mode="indeterminate" />;
    }
    return content;
  }
});

