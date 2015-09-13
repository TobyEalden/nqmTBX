
nqmTBX.vis.Sheet = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
  },
  getMeteorData: function() {
    // Load the visualisations for this sheet.
    var visSub = Meteor.subscribe("widgets");

    return {
      ready: visSub.ready(),
      visualisations: widgets.find().fetch()
    }
  },
  render: function() {
    var content;
    if (this.data.ready) {
      content = <nqmTBX.vis.SheetView visualisations={this.data.visualisations} />
    } else {
      content = <mui.CircularProgress mode="indeterminate" />
    }

    return content;
  }
});

nqmTBX.vis.SheetView = React.createClass({
  propTypes: {
    visualisations: React.PropTypes.array.isRequired
  },
  getInitialState: function() {
    return {
      isSaving: false,
      isUpdating: false,
      isDirty: false,
      gridReady: false,
      dirtyItems: {}
    }
  },
  initGridstack: function() {
    var self = this;

    // Initialise grid-stack.
    var options = {
      animate: false,
      auto: true,
      static_grid: false,
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

    // Register to be notified of gridstack changes.
    $(dom).on("change", function(e,items) {
      if (!self.state.isUpdating) {
        if (items.length > 0) {
          // Keep a cache of items that need saving.
          var dirty = self.state.dirtyItems;
          _.each(items, function(it) {
            var visId = it.el.data().widgetId;
            Session.set("nqm-vis-grid-update-" + visId, true);
            dirty[visId] = it;
          });
          self.setState({isDirty: true, dirtyItems: dirty});
        }        
      } else {
        console.log("ignoring grid change during update");
      }
    });

    // Register a handler for window resizing.
    var layout = _.debounce(this.onWindowResized, 500);
    $(window).resize(layout);

    // Set grid ready state.
    if (!this.state.gridReady) {
      this.setState({gridReady: true });
    }
  },
  saveWidgetPosition: function(id, pos, cb) {
    console.log("saving widget position: " + id);
    Meteor.call("/app/widget/updatePosition",{ _id: id, position: pos}, function(err) {
      if (err) {
        nqmTBX.ui.notification("failed to save widget position: " + err.message);
        cb();
      } else {
        console.log("saved widget position: " + id);
        cb();
      }
    });
  },
  save: function() {
    this.setState({isSaving: true});
    _.each(this.state.dirtyItems, function(item,k) {
      var widgetId = item.el.data().widgetId;
      var current = widgets.findOne({_id: new Meteor.Collection.ObjectID(widgetId)});
      if (!current.position || current.position.x != item.x || current.position.y != item.y || current.position.w != item.width || current.position.h != item.height) {
        this.saveWidgetPosition(widgetId,{ x: item.x, y: item.y, w: item.width, h: item.height }, function() {
          nqmTBX.ui.notification("saved " + widgetId);
        });
      }
    }, this);
    this.setState({isDirty: false});
    this.setState({isSaving: false});
  },
  updatePositions: function(props) {
    this.setState({isUpdating: true}, function() {
      if (false && this.state.isDirty) {
        // TODO - fix, use auto-save or allow override.
        console.log("ignored update from external source when sheet is dirty");
      } else {
        var dom = this.getDOMNode();
        var grid = $(dom).data("gridstack");

        _.each(props.visualisations, function(v) {
          var nodeElement = $("#nqm-vis-" + v._id);
          grid.update(nodeElement,v.position.x,v.position.y,v.position.w,v.position.h);
        });
      }
      this.setState({isUpdating: false});      
    });
  },
  invalidateAll: function() {
    console.log("invalidate all");
    _.each(this.props.visualisations, function(v) {
      Session.set("nqm-vis-grid-update-" + v._id, true);
    });
  },
  onWindowResized: function(ev, ui) {
    if (ev.target === window) {
      this.invalidateAll();
    }
  },
  componentDidMount: function() {
    // If data is ready but the grid has not been initialised, do so now.
    if (!this.state.gridReady) {
      this.initGridstack();
    }
  },
  componentDidUpdate: function() {
    // If data is ready but the grid has not been initialised, do so now.
    if (!this.state.gridReady) {
      this.initGridstack();
    }
  },
  shouldComponentUpdate: function(props, state) {
    // TODO - review for sheets with pure React components.
    // No need to update if the data and grid are already up.
    if (this.state.gridReady) {
      //this.updatePositions(props);
      this.invalidateAll();
      return true; //false;
    } else {
      return true;
    }
  },
  render: function() {
    var styles = {
      actionButton: {
        position: "fixed",
        bottom: "15px",
        right: "15px"
      }
    };

    var content;
    var visualisations = this.props.visualisations.map(function(vis) {
      return <nqmTBX.vis.Container key={vis._id} config={vis} />;
    },this);

    content = (
      <div className="grid-stack">
        {visualisations}
        <mui.FloatingActionButton style={styles.actionButton} onClick={this.save} tooltip="new dataset"><mui.FontIcon className="material-icons">add</mui.FontIcon></mui.FloatingActionButton>
      </div>
    );

    return content;
  }
});