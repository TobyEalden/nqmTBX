
nqmTBX.pages.Visualise = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var searchTerm = Session.get("nqm-search") || "";
    var dsSub, account, resourceIds = [];
    var accountSub = Meteor.subscribe("account");
    if (accountSub.ready()) {
      account = accounts.findOne();
      resourceIds = _.map(account.resources, function(v,k) { return k; });
      dsSub = Meteor.subscribe("visualisations", { id: {$in: resourceIds}, $or: [ {name: {$regex: searchTerm, $options: "i"}}, {description: {$regex: searchTerm, $options: "i"} }, {tags: {$regex: searchTerm, $options: "i"}}]});
    }
    return {
      ready: accountSub.ready() && dsSub && dsSub.ready(),
      visualisations: visualisations.find({ id: {$in: resourceIds}, $or: [ {name: {$regex: searchTerm, $options: "i"}}, {description: {$regex: searchTerm, $options: "i"}}, {tags: {$regex: searchTerm, $options: "i"}}]}, {sort: {name: 1}}).fetch(),
      user: Meteor.user(),
      marginLeft: Session.get("nqm-sidebar-open") ? "200px" : "0px"
    }
  },
  getInitialState: function() {
    return {
    }
  },
  _onAddResource: function() {
    FlowRouter.go("visualCreate");
  },
  _onEditClick: function(dataset, e) {
    FlowRouter.go("visualEdit", {id: dataset.id});
  },
  _onViewClick: function(dataset, e) {
    FlowRouter.go("visualView", {id: dataset.id});
  },
  _onDeleteClick: function(dataset, e) {
    Meteor.call("/app/visualisation/delete",dataset.id,nqmTBX.helpers.methodCallback("deleteVisualisation"));
  },
  _onDefaultClick: function(dataset, e) {
    FlowRouter.go("visualView", {id: dataset.id});
  },
  _onAPIClick: function(e) {
    e.stopPropagation();
  },
  render: function() {
    var styles = this._getStyles();
    var toolbar = (
      <mui.Toolbar className="nqm-sub-toolbar" style={styles.toolbar}>
        <mui.ToolbarGroup>
        </mui.ToolbarGroup>
        <mui.ToolbarGroup>
          <mui.FontIcon color={appPalette.textColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this._onAddResource} >add</mui.FontIcon>
          <mui.FontIcon color={appPalette.textColor} hoverColor={appPalette.accent1Color} className="material-icons" >view_module</mui.FontIcon>
        </mui.ToolbarGroup>
      </mui.Toolbar>
    ) ;
    var content = <nqmTBX.ResourceList type="Visualisation" resources={this.data.visualisations} onDefault={this._onDefaultClick} onEdit={this._onEditClick} onView={this._onViewClick} onDelete={this._onDeleteClick} />;

    return (
      <div className="nqm-page-content">
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
        overflowY: "auto",
        position: "absolute",
        top: "112px",
        right: "0px",
        bottom: "0px",
        left: this.data.marginLeft
      },
      toolbar: {
        marginLeft: this.data.marginLeft,
        width: "auto",
        paddingLeft: 0
      },
    };
  }
});

