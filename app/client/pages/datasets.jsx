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
    //var dsSub = Meteor.subscribe("datasets", Session.get("force-dataset-sub"));
    //var accSub = Meteor.subscribe("account");
    //
    //if (accSub.ready()) {
    //  // This forces the dataset subscription to refresh when the account timestamp changes.
    //  var account = accounts.findOne({});
    //  if (account) {
    //    console.log("account updated - about to refresh datasets");
    //    Session.set("force-dataset-sub", { force: account.modified });
    //  }
    //}
    var dsSub = Meteor.subscribe("datasets");

    return {
      datasets: datasets.find({ $or: [ {name: searchTerm}, {description: searchTerm }, {tags: searchTerm }]}).fetch()
    }
  },
  _onCardExpanded: function(card) {
    for (var ds in this.refs) {
      if (this.refs[ds] !== card) {
        this.refs[ds].expand(false);
      }
    }
  },
  _onAddDataset: function() {
    FlowRouter.go("datasetCreate");
  },
  render: function() {
    var styles = {
      root: {
      },
      datasetList: {
        paddingTop: 60
      },
      actionButton: {
        position: "fixed",
        bottom: "15px",
        right: "15px"
      },
      toolbar: {
        paddingLeft: "4px",
        position: "fixed"
      },
      iconButton: {
        color: "white",
        hoverColor: "white"
      }
    };
    var toolbar = (
      <mui.Toolbar style={styles.toolbar} zDepth={2}>
        <mui.ToolbarGroup>
          <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this._onAddDataset} >add</mui.FontIcon>
        </mui.ToolbarGroup>
      </mui.Toolbar>
    ) ;
    var cards;
    cards = this.data.datasets.map(function(ds) {
      return <nqmTBX.DatasetSummary key={ds.id} ref={ds.id} dataset={ds} onSummaryExpanded={this._onCardExpanded} />;
    }, this);

    return (
      <div style={styles.root}>
        {toolbar}
        <div style={styles.datasetList}>
          {cards}
        </div>
      </div>
    );
  }
});