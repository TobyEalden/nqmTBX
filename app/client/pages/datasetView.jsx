
nqmTBX.pages.DatasetViewPage = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    datasetId: React.PropTypes.string.isRequired
  },
  getMeteorData: function() {
    var dsSub = Meteor.subscribe("datasets",{id: this.props.datasetId });
    return {
      ready: dsSub.ready(),
      dataset: datasets.findOne({id: this.props.datasetId})
    }
  },
  render: function() {
    var styles = {
      root: {
        paddingTop: 5
      }
    };
    if (this.data.ready) {
      return (
        <div style={styles.root}>
          <nqmTBX.DatasetBasicView dataset={this.data.dataset} />
        </div>
      );
    } else {
      return <mui.CircularProgress mode="indeterminate" />;
    }
  }
});