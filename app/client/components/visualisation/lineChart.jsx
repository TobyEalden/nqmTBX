
nqmTBX.vis.LineChart = React.createClass({
  mixins: [ReactMeteorData],
  displayName: "nqmTBX.vis.LineChart",
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
    this._visualisation = new NQMLineChart(this);
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
      content = <svg id={"LineChart-" + this.props.config._id} className="nqm-svg"></svg>;
    } else {
      content = <div style={{textAlign:"center", paddingTop: "10px"}}><mui.CircularProgress mode="indeterminate" /></div>;
    }
    return content;
  }
});

