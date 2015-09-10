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
    var dsSub = Meteor.subscribe("datasets");
    var tzSub = Meteor.subscribe("localTrustZones");

    return {
      ready: dsSub.ready() && tzSub.ready(),
      currentUser: Meteor.user(),
      datasets: datasets.find({ $or: [ {name: searchTerm}, {description: searchTerm }, {tags: searchTerm }]}).fetch(),
      trustZones: trustedUsers.find({owner: Meteor.user().username})
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
    var cards = this.data.datasets.map(function(ds) {
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