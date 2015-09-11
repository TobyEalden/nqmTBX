
nqmTBX.DatasetBasicView = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    dataset: React.PropTypes.object
  },
  getMeteorData: function() {
    var dsDataSub, datasetData, columns = [];
    if (this.props.dataset) {
      dsDataSub = Meteor.subscribe(this.props.dataset.store, {});
    }
    if (dsDataSub && dsDataSub.ready()) {
      datasetData = datasetDataCache[this.props.dataset.store].find().fetch();
      columns = this._columnMap(this.props.dataset);
    }
    return {
      ready: dsDataSub && dsDataSub.ready(),
      data: datasetData,
      columns: columns
    }
  },
  _columnMap: function(dataset) {
    var columns = [];
    if (dataset) {
      _.each(dataset.scheme, function(v,k) {
        if (k.indexOf("_") !== 0) {
          columns.push(k);
        }
      });
    }
    return columns;
  },
  getInitialState: function() {
    return {
    }
  },
  render: function() {
    if (this.data.ready) {
      return <Griddle
        results={this.data.data}
        columns={this.data.columns}
        showFilter={true}
        showSettings={true}
        resultsPerPage={25}
        useGriddleStyles={true}
        useFixedHeader={false}
        settingsText={""}
        settingsIconComponent={<i className="material-icons">settings</i>} />;
    } else {
      return <mui.CircularProgress mode="indeterminate" />;
    }
  }
});
