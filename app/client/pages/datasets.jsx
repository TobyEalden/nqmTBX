const {
  Card,
  CardTitle,
  CardText,
  FloatingActionButton,
  FontIcon
} = mui;

DatasetsPage = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var searchTerm = new RegExp(Session.get("nqm-search"),"gi");
    var dsSub = Meteor.subscribe("datasets", Session.get("force-dataset-sub"));
    var accSub = Meteor.subscribe("account");

    if (accSub.ready()) {
      // This forces the dataset subscription to refresh when the account timestamp changes.
      var account = accounts.findOne({});
      if (account) {
        Session.set("force-dataset-sub", { force: account.modified });
      }
    }

    return {
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
    var styles = {
      actionButton: {
        position: "fixed",
        bottom: "15px",
        right: "15px"
      }
    };
    var cards;
    cards = this.data.datasets.map(function(ds) {
      return <DatasetSummary key={ds.id} ref={ds.id} dataset={ds} onSummaryExpanded={this.onCardExpanded} />;
    }, this);

    return (
      <div className="">
        {cards}
        <FloatingActionButton style={styles.actionButton} linkButton={true} href="/dataset/create" tooltip="new dataset"><FontIcon className="material-icons">add</FontIcon></FloatingActionButton>
      </div>
    );
  }
});