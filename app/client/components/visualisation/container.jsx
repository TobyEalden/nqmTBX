
nqmTBX.vis.Container = React.createClass({
  displayName: "nqmTBX.vis.Container",
  propTypes: {
    grid: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
      grid: this.props.grid
    }
  },
  componentDidMount: function() {
    var dom = React.findDOMNode(this);
    //this.props.grid.add_widget(dom, this.props.config.position.x, this.props.config.position.y, this.props.config.position.w, this.props.config.position.h);
  },
  componentWillReceiveProps: function(newProps) {
    if (this.props.grid !== newProps.grid) {
      var dom = this.getDOMNode();
      newProps.grid.add_widget(dom, this.props.config.position.x, this.props.config.position.y, this.props.config.position.w, this.props.config.position.h);
    }
    this.setState({grid: newProps.grid});
  },
  render: function() {
    // TODO - handle failure.
    var vis = React.createElement(nqmTBX.vis[this.props.config.type], { grid: this.state.grid, config: this.props.config });

    return (
      <div className="grid-stack-item nqm-grid-stack-item" data-widget-id={this.props.config._id} data-gs-x={this.props.config.position.x} data-gs-y={this.props.config.position.y} data-gs-width={this.props.config.position.w} data-gs-height={this.props.config.position.h}>
        <mui.Paper id={"nqm-vis-card-" + this.props.config._id} className="grid-stack-item-content card">
          <div id={"nqm-vis-title-" + this.props.config._id} className="nqm-visualisationTitle">
            <span className="">{this.props.config.name}</span>
          </div>
          {vis}
        </mui.Paper>
      </div>
    );
  }
});