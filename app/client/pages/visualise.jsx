var BasicLayout = React.createClass({
  mixins: [React.PureRenderMixin],

  componentDidMount: function() {
    var ev = document.createEvent('Event');
    ev.initEvent('resize', true, true);
    window.dispatchEvent(ev);
  },

  getDefaultProps: function() {
    return {
      className: "layout",
      items: 20,
      rowHeight: 30,
      cols: 12
    };
  },

  getInitialState: function() {
    var layout = this.generateLayout();
    return {
      layout: layout
    };
  },

  generateDOM: function() {
    return _.map(_.range(this.props.items), function(i) {
      return (<div key={i}><span className="text">{i}</span></div>);
    });
  },

  generateLayout: function() {
    var p = this.props;
    var layout = [];
    var y;
    for (i = 0; i <= p.items - 1; i++) {
      y = p['y'] || Math.ceil(Math.random() * 4) + 1;
      layout[i] = {x: i * 2 % 12, y: Math.floor(i / 6) * y, w: 2, h: y, i: i};
    }
    return layout;
  },

  render: function() {
    return (
      <ReactGridLayout layout={this.state.layout} {...this.props}>
        {this.generateDOM()}
      </ReactGridLayout>
    );
  }
});

VisualisePage = React.createClass({
  render: function() {
    return (
      <div id="content">
        <BasicLayout />
      </div>
    );
  }
});

