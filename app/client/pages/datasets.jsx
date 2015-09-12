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
    var searchTerm = Session.get("nqm-search") || "";
    var accountSub = Meteor.subscribe("account");
    var dsSub, account, accountIds = [];
    if (accountSub.ready()) {
      account = accounts.findOne();
      _.each(account.resources, function(v,k) {
        accountIds.push(k);
      });
      dsSub = Meteor.subscribe("datasets", { id: {$in: accountIds}, $or: [ {name: {$regex: searchTerm}}, {description: {$regex: searchTerm} }, {tags: {$regex: searchTerm}}]});
    }
    return {
      ready: accountSub.ready() && dsSub && dsSub.ready(),
      datasets: datasets.find({ id: {$in: accountIds}, $or: [ {name: {$regex: searchTerm}}, {description: {$regex: searchTerm}}, {tags: {$regex: searchTerm}}]}, {sort: {name: 1}}).fetch()
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
    var cards = [];
    if (true || this.data.ready) {
      _.each(this.data.datasets, function(ds) {
        var card = <nqmTBX.DatasetSummary key={ds.id} ref={ds.id} dataset={ds} onSummaryExpanded={this._onCardExpanded} />;
        cards.push(card);
      }, this);
    } else {
      cards = <mui.CircularProgress mode="indeterminate" />;
    }

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