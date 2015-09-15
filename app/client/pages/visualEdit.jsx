
nqmTBX.pages.VisualEdit = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    resourceId: React.PropTypes.string
  },
  getMeteorData: function() {
    var data = {
    };
    if (this.props.resourceId) {
      var dsSub = Meteor.subscribe("visualisations", { id: this.props.resourceId });
      data.ready = dsSub.ready();
      data.resource = visualisations.findOne({id: this.props.resourceId});
    } else {
      data.ready = true;
      data.resource = {};
    }

    return data;
  },
  render: function() {
    if (!this.data.ready) {
      return <mui.CircularProgress mode="indeterminate" />
    } else {
      if (this.data.resource) {
        return <nqmTBX.EditSheet resource={this.data.resource} />
      } else {
        // TODO - tart this up.
        return <div>not found</div>
      }
    }
  }
});