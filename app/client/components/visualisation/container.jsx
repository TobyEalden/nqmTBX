
nqmTBX.vis.Container = React.createClass({
  displayName: "nqmTBX.vis.Container",
  propTypes: {
    config: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
    }
  },
  componentDidMount: function() {
  },
  componentWillReceiveProps: function(newProps) {
    console.log("new props: " + newProps);
  },
  render: function() {
    // TODO - handle failure.
    var vis = React.createElement(nqmTBX.vis[this.props.config.type], { config: this.props.config });

    return (
      <div id={"nqm-vis-" + this.props.config._id} className="grid-stack-item nqm-grid-stack-item" data-widget-id={this.props.config._id} data-gs-x={this.props.config.position.x} data-gs-y={this.props.config.position.y} data-gs-width={this.props.config.position.w} data-gs-height={this.props.config.position.h}>
        <div id={"nqm-vis-card-" + this.props.config._id} className="grid-stack-item-content card" zDepth={0}>
          <div id={"nqm-vis-title-" + this.props.config._id} className="nqm-visualisationTitle">
            <span className="">{this.props.config.name}</span>
          </div>
          {vis}
        </div>
      </div>
    );
  }
});