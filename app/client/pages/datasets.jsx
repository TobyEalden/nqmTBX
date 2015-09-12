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
      datasets: datasets.find({ id: {$in: accountIds}, $or: [ {name: {$regex: searchTerm}}, {description: {$regex: searchTerm}}, {tags: {$regex: searchTerm}}]}, {sort: {name: 1}}).fetch(),
      user: Meteor.user()
    }
  },
  getInitialState: function() {
    return {
      activeDataset: Session.get("nqm-active-dataset"),
      hoveredDataset: null
    }
  },
  _onAddDataset: function() {
    FlowRouter.go("datasetCreate");
  },
  _onShareClick: function(dataset, e) {
    e.stopPropagation();
    FlowRouter.go("datasetShare", {id: dataset.id});
  },
  _onEditClick: function(dataset, e) {
    e.stopPropagation();
    FlowRouter.go("datasetEdit", {id: dataset.id});
  },
  _onViewClick: function(dataset, e) {
    e.stopPropagation();
    FlowRouter.go("datasetView", {id: dataset.id});
  },
  _onDeleteClick: function(dataset, e) {
    e.stopPropagation();
    nqmTBX.ui.notification("deleting " + dataset.id);
  },
  _onRowSelection: function(ds) {
    if (ds.id === this.state.activeDataset) {
      this.setState({ activeDataset: null });
      Session.set("nqm-active-dataset",null);
    } else {
      this.setState({ activeDataset: ds.id });      
      Session.set("nqm-active-dataset",ds.id);
    }
  },
  _onRowHover: function(ds) {
    this.setState({ hoveredDataset: ds.id });
  },
  _getRowButtons: function(dataset) {
    var buttons = [];
    var buttonStyle = {
      float: "right",
    };
    var iconStyle = {
      color: appPalette.nqmTBXListIconColor
    };
    if (this.state.hoveredDataset === dataset.id) {
      buttons.push(<mui.IconButton key={4} style={buttonStyle} iconStyle={iconStyle} iconClassName="material-icons" onClick={this._onEditClick.bind(this,dataset)}>more_vert</mui.IconButton>);
      buttons.push(<mui.IconButton key={3} style={buttonStyle} iconStyle={iconStyle} iconClassName="material-icons" onClick={this._onDeleteClick.bind(this,dataset)}>delete</mui.IconButton>);
      buttons.push(<mui.IconButton key={2} style={buttonStyle} iconStyle={iconStyle} iconClassName="material-icons" onClick={this._onEditClick.bind(this,dataset)}>edit</mui.IconButton>);
      buttons.push(<mui.IconButton key={1} style={buttonStyle} iconStyle={iconStyle} iconClassName="material-icons" onClick={this._onViewClick.bind(this,dataset)}>pageview</mui.IconButton>);
      if (dataset.owner === this.data.user.username) {
        buttons.push(<mui.IconButton key={0} style={buttonStyle} iconStyle={iconStyle} iconClassName="material-icons" onClick={this._onShareClick.bind(this,dataset)}>share</mui.IconButton>);
      }
    }
    return buttons;
  },
  render: function() {
    var styles = {
      root: {
      },
      datasetPanel: {
        marginTop: 60,
      },
      datasetList: {
        margin: 10,
      },
      actionButton: {
        position: "fixed",
        bottom: "15px",
        right: "15px"
      },
      toolbar: {
        paddingLeft: "4px",
        position: "fixed",
        zIndex: 1
      },
      iconButton: {
        color: "white",
        hoverColor: "white"
      },
      headerRow: {
        padding: 4
      },
      row: {
        height: "50px",
        lineHeight: "50px",
        margin: 0,
        verticalAlign: "middle",
        borderWidth: 0,
        borderTopWidth: 1,
        borderColor: appPalette.primary2Color,
        borderStyle: "solid",
        padding: "4px 4px 0px 4px",
        color: appPalette.nqmTBXListTextColor,
        backgroundColor: appPalette.nqmTBXListBackground,
      },
      activeRow: {
        margin: 0,
        verticalAlign: "middle",
        borderWidth: 0,
        borderTopWidth: 1,
        borderColor: appPalette.primary2Color,
        borderStyle: "solid",
        padding: "4px 4px 0px 4px",
        color: appPalette.nqmTBXListTextColor,
        backgroundColor: appPalette.nqmTBXListBackground,
        minHeight: 120
      },
      nameColumnInner: {
        borderWidth: 0,
        borderLeftColor: "transparent",
        borderLeftWidth: 2,
        borderStyle: "solid",
      },
      nameColumnInnerActive: {
        borderWidth: 0,
        borderLeftColor: appPalette.accent3Color,
        borderLeftWidth: 2,
        borderStyle: "solid",
      },
      nameColumn: {
        width: "50%!important",
        flex: "none!important",
        textAlign: "left"
      },
      ownerColumn: {
        textAlign: "left"
      },
      modifiedColumn: {
        textAlign: "left"
      },
      actionColumn: {
        minWidth: 245,
        textAlign: "right"
      },
      avatar: {
        verticalAlign: "middle"
      }
    };
    var toolbar = (
      <mui.Toolbar style={styles.toolbar}>
        <mui.ToolbarGroup>
          <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this._onAddDataset} >add</mui.FontIcon>
        </mui.ToolbarGroup>
      </mui.Toolbar>
    ) ;
    var content;
    if (this.data.ready || this.data.datasets.length > 0) {
      var datasetList = [];
      _.each(this.data.datasets, function(ds) {
        var buttons = this._getRowButtons(ds);
        var row = (
          <div key={ds.id} className="Grid" style={this.state.activeDataset === ds.id ? styles.activeRow : styles.row} key={ds.id} onMouseOver={this._onRowHover.bind(this,ds)} onClick={this._onRowSelection.bind(this,ds)}>
            <div className="Grid-cell .Grid--1of2" style={styles.nameColumn}>
              <div style={this.state.activeDataset === ds.id ? styles.nameColumnInnerActive : styles.nameColumnInner}>
                <mui.FontIcon style={styles.avatar} className="material-icons">view_headline</mui.FontIcon> {ds.name}
              </div>
            </div>
            <div className="Grid-cell" style={styles.ownerColumn}>{ds.owner}</div>            
            <div className="Grid-cell"  style={styles.actionColumn}>{buttons}</div>
          </div>
        );
        datasetList.push(row);
      }, this);

      content = (
        <div className="" style={styles.datasetPanel}>
          <div className="Grid" style={styles.headerRow}>
            <div className="Grid-cell" style={styles.nameColumn}>name</div>
            <div className="Grid-cell" style={styles.ownerColumn}>owner</div>
            <div className="Grid-cell" style={styles.actionColumn}>actions</div>
          </div>
          <mui.Paper style={styles.datasetList}>
            {datasetList}
          </mui.Paper>
        </div>
      );
    } else {
      content = <mui.CircularProgress mode="indeterminate" />;
    }

    return (
      <div>
        <div style={styles.root}>
          {toolbar}
        </div>
        <div style={styles.root}>
          {content}
        </div>
      </div>
    );
  }
});