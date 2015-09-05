
nqmTBX.vis.Sheet = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {

  },
  getMeteorData: function() {
    var visSub = Meteor.subscribe("widgets");

    return {
      ready: visSub.ready(),
      visualisations: widgets.find().fetch()
    }
  },
  getInitialState: function() {
    return {
      gridReady: false,
      grid: {}
    }
  },
  initGridstack: function() {
    var self = this;

    // Initialise grid-stack.
    var options = {
      animate: false,
      auto: true,
      float: false,
      cell_height: 80,
      vertical_margin: 20,
      resizable: {
        handles: 'e, se, s, sw, w'
      },
      always_show_resize_handle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };
    var dom = this.getDOMNode();
    $(dom).gridstack(options);
    $(dom).on("change", function(e,items) {
      if (!self._ignoreUpdates && items.length > 0) {
        _.forEach(items, function(it) {
          Session.set("nqm-vis-grid-update-" + it.el.data().widgetId, true);
        });
      }
    });
    var grid = $(dom).data("gridstack");

    var layout = _.debounce(this.onWindowResized, 500);
    $(window).resize(layout);

    if (!this.state.gridReady) {
      this.setState({gridReady: true });
    }
  },
  invalidateAll: function() {
    console.log("layout");
    _.each(this.data.visualisations, function(v) {
      Session.set("nqm-vis-grid-update-" + v._id, true);
    });
  },
  onWindowResized: function(ev, ui) {
    if (ev.target === window) {
      this.invalidateAll();
    }
  },
  componentDidMount: function() {
    if (this.data.ready && !this.state.gridReady) {
      this.initGridstack();
    }
  },
  componentDidUpdate: function() {
    if (this.data.ready && !this.state.gridReady) {
      this.initGridstack();
    }
  },
  shouldComponentUpdate: function(props, state) {
    if (this.data.ready && this.state.gridReady) {
      this.invalidateAll();
      return false;
    } else {
      return true;
    }
  },
  render: function() {

    var content;
    if (this.data.ready) {
      var visualisations = this.data.visualisations.map(function(vis) {
        return <nqmTBX.vis.Container key={vis._id} grid={this.state.grid} config={vis} />;
      },this);

      content = (
        <div className="grid-stack">
          {visualisations}
        </div>
      );
    } else {
      content = <mui.CircularProgress mode="indeterminate" />
    }

    return content;
  }
});