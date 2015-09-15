
VisualisePage = React.createClass({
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
      user: Meteor.user()
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
  _onAPIClick: function(e) {
    e.stopPropagation();
  },
  render: function() {
    var styles = this._getStyles();
    var toolbar = (
      <mui.Toolbar style={styles.toolbar}>
        <mui.ToolbarGroup>
        </mui.ToolbarGroup>
        <mui.ToolbarGroup>
          <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this._onAddResource} >add</mui.FontIcon>
          <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" >view_module</mui.FontIcon>
        </mui.ToolbarGroup>
      </mui.Toolbar>
    ) ;
    var content = <nqmTBX.ResourceList type="Visualisation" resources={this.data.visualisations} onEdit={this._onEditClick} onView={this._onViewClick} onDelete={this._onDeleteClick} />;

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

