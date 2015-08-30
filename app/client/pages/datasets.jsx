const {
  IconMenu,
  Menu,
  MenuItem,
  IconButton,
  Card,
  CardTitle,
  CardText
} = mui;

DatasetsPage = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var searchTerm = new RegExp(Session.get("nqm-search"),"gi");

    return {
      currentUser: Meteor.user(),
      datasets: datasets.find({ $or: [ {name: searchTerm}, {description: searchTerm }, {tags: searchTerm }]}).fetch()
    }
  },
  onCardExpanded: function(card) {
    for (var ds in this.refs) {
      if (this.refs[ds] !== card) {
        this.refs[ds].expand(false);
      }
    }
  },
  render: function() {
    var cards = this.data.datasets.map(function(ds) {
      return <DatasetSummary key={ds.id} ref={ds.id} dataset={ds} onSummaryExpanded={this.onCardExpanded} />;
    }, this);

    return (<div className="">{cards}</div>);
  }
});