
nqmTBX.pages.VisualAddWidget = React.createClass({
  propTypes: {
    resourceId: React.PropTypes.string
  },
  _onAddWidget: function(data) {
    var opts = {
      visId: this.props.resourceId,
      type: data.widgetType,
      title: Random.id(),
      position: { x: 0, y: 0, w:4, h: 2},
      inputs: [
        {
          datasource: data.resourceId,
          series: "timestamp",
          datum: data.datum
        }
      ]
    };
    Meteor.call("/app/visualisation/addWidget",opts,nqmTBX.helpers.methodCallback("addWidget"));
  },
  render: function() {
    var styles = {
      root: {
        margin: 10
      }
    };
    return (
      <div style={styles.root}>
        <nqmTBX.AddWidget onAdd={this._onAddWidget} />
      </div>
      );
  }
});