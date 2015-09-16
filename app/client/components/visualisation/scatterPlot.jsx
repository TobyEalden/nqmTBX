
nqmTBX.vis.ScatterPlot = React.createClass({
  mixins: [ReactMeteorData],
  displayName: "nqmTBX.vis.ScatterPlot",
  propTypes: {
    config: React.PropTypes.object.isRequired
  },
  getMeteorData: function() {
    var feedSub = timeSeriesBase.startSubscriptions.call(this);
    return {
      ready: feedSub && feedSub.ready()
    };
  },
  getInitialState: function() {
    return {
      gotDataset: false,
      gotData: false
    }
  },
  componentDidMount: function() {
    // Create the visualisation.
    this._visualisation = new NQMScatterPlot(this);
    this._debugTiming = true;
  },
  componentWillUnmount: function() {
    timeSeriesBase.destroy.call(this);
  },
  shouldComponentUpdate: function() {
    if (this.data.ready && this.state.gotDataset && this.state.gotData) {
      this._visualisation.checkSize();
      return false;
    } else {
      return true;
    }
  },
  render: function() {
    var styles = {
      message: {
        textAlign:"center",
        paddingTop: "10px"
      }
    };
    var content;
    if (this.data.ready) {
      if (this.state.gotDataset) {
        if (this.state.gotData) {
          content = <svg id={"ScatterPlot-" + this.props.config.id} className="nqm-svg"></svg>;
        } else {
          content = <div style={styles.message}>
            <mui.CircularProgress mode="indeterminate" size={0.5} />
            <h4>waiting for data</h4>
          </div>;
        }
      } else {
        content = <div style={styles.message}>dataset not found or permission denied</div>;
      }
    } else {
      content = <div style={styles.message}><mui.CircularProgress mode="indeterminate" /></div>;
    }
    return content;
  }
});

