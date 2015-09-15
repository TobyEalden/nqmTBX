
nqmTBX.pages.Datasets = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var searchTerm = Session.get("nqm-search") || "";
    var dsSub, account, resourceIds = [];
    var accountSub = Meteor.subscribe("account");
    if (accountSub.ready()) {
      account = accounts.findOne();
      resourceIds = _.map(account.resources, function(v,k) { return k; });      
      dsSub = Meteor.subscribe("datasets", { id: {$in: resourceIds}, $or: [ {name: {$regex: searchTerm, $options: "i"}}, {description: {$regex: searchTerm, $options: "i"} }, {tags: {$regex: searchTerm, $options: "i"}}]});
    }
    return {
      ready: accountSub.ready() && dsSub && dsSub.ready(),
      datasets: datasets.find({ id: {$in: resourceIds}, $or: [ {name: {$regex: searchTerm, $options: "i"}}, {description: {$regex: searchTerm, $options: "i"}}, {tags: {$regex: searchTerm, $options: "i"}}]}, {sort: {name: 1}}).fetch(),
      user: Meteor.user()
    }
  },
  getInitialState: function() {
    return {
    }
  },
  _onAddDataset: function() {
    FlowRouter.go("datasetCreate");
  },
  _onEditClick: function(dataset, e) {
    FlowRouter.go("datasetEdit", {id: dataset.id});
  },
  _onViewClick: function(dataset, e) {
    FlowRouter.go("datasetView", {id: dataset.id});
  },
  _onDeleteClick: function(dataset, e) {
    Meteor.call("/app/dataset/delete",dataset.id,nqmTBX.helpers.methodCallback("deleteDataset"));
  },
  _onAPIClick: function(e) {
    e.stopPropagation();    
  },
  _getActiveContent: function(dataset) {
    var styles = {
      apiLink: {
        padding: "4px 4px 4px 0px",
        color: appPalette.nqmTBXListTextColor,
        backgroundColor: appPalette.nqmTBXListBackground,
      },
      apiLinkIcon: {
        color: appPalette.nqmTBXListIconColor,
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: "20px",
        verticalAlign: "middle"
      },
    };
    return (
      <div className="Grid" style={styles.apiLink}>
        <div className="Grid-cell">
          <mui.FontIcon style={styles.apiLinkIcon} className="material-icons">link</mui.FontIcon> <a href={"/api/datasets/" + dataset.id} target="_blank" onClick={this._onAPIClick}>{"API Link"}</a>
        </div>
      </div>    
    );
  },
  render: function() {
    var styles = this._getStyles();
    var toolbar = (
      <mui.Toolbar style={styles.toolbar}>
        <mui.ToolbarGroup>
        </mui.ToolbarGroup>
        <mui.ToolbarGroup>
          <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this._onAddDataset} >add</mui.FontIcon>
          <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" >view_module</mui.FontIcon>
        </mui.ToolbarGroup>
      </mui.Toolbar>
    ) ;
    var content = <nqmTBX.ResourceList type="Dataset" resources={this.data.datasets} getActiveContent={this._getActiveContent} onEdit={this._onEditClick} onView={this._onViewClick} onDelete={this._onDeleteClick} />;

    return (
      <div>
        {toolbar}
        <div style={styles.resourcePanel}>
          {content}
        </div>
      </div>
    );
  },
  _getStyles: function() {
    return styles = {
      resourcePanel: {
        marginTop: 60,
      },
      toolbar: {
        paddingLeft: "4px",
        position: "fixed",
        backgroundColor: appPalette.primary3Color,
        zIndex: 1
      },
    };
  }
});