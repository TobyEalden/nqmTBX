
const {
  CircularProgress,
  } = mui;

DatasetEditPage = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    datasetId: React.PropTypes.string
  },
  getMeteorData: function() {
    var data = {
    };
    if (this.props.datasetId) {
      var dsSub = Meteor.subscribe("datasets", { id: this.props.datasetId });
      data.ready = dsSub.ready();
      data.dataset = datasets.findOne({id: this.props.datasetId});
    } else {
      data.ready = true;
      data.dataset = {};
    }

    return data;
  },
  render: function() {
    if (!this.data.ready) {
      return <CircularProgress mode="indeterminate" />
    } else {
      if (this.data.dataset) {
        return <EditDataset dataset={this.data.dataset} />
      } else {
        // TODO - tart this up.
        return <div>not found</div>
      }
    }
  }
});