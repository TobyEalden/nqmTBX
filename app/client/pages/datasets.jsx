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
      dsSub = Meteor.subscribe("datasets", { id: {$in: accountIds}, $or: [ {name: {$regex: searchTerm, $options: "i"}}, {description: {$regex: searchTerm, $options: "i"} }, {tags: {$regex: searchTerm, $options: "i"}}]});
    }
    return {
      ready: accountSub.ready() && dsSub && dsSub.ready(),
      datasets: datasets.find({ id: {$in: accountIds}, $or: [ {name: {$regex: searchTerm, $options: "i"}}, {description: {$regex: searchTerm, $options: "i"}}, {tags: {$regex: searchTerm, $options: "i"}}]}, {sort: {name: 1}}).fetch(),
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
  _onMoreClick: function(e) {
    e.stopPropagation();
  },
  _onAPIClick: function(e) {
    e.stopPropagation();    
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
      var iconMenu = (
        <mui.IconMenu openDirection="bottom-left" key={4} style={buttonStyle} iconButtonElement={<mui.IconButton key={5} tooltip="more" style={buttonStyle} iconStyle={iconStyle} iconClassName="material-icons" onClick={this._onMoreClick}>more_vert</mui.IconButton>}>
          <mui.MenuItem key={1} primaryText="quick view" onClick={this._onViewClick.bind(this,dataset)} />
          <mui.MenuItem key={0} primaryText="delete" onClick={this._onDeleteClick.bind(this,dataset)} />
          <mui.MenuItem key={2} primaryText="settings" />
        </mui.IconMenu>
      );
      buttons.push(iconMenu);
      // buttons.push(<mui.IconButton key={3} style={buttonStyle} iconStyle={iconStyle} iconClassName="material-icons" onClick={this._onDeleteClick.bind(this,dataset)}>delete</mui.IconButton>);
      buttons.push(<mui.IconButton key={2} tooltip="edit" style={buttonStyle} iconStyle={iconStyle} iconClassName="material-icons" onClick={this._onEditClick.bind(this,dataset)}>edit</mui.IconButton>);
      // buttons.push(<mui.IconButton key={1} style={buttonStyle} iconStyle={iconStyle} iconClassName="material-icons" onClick={this._onViewClick.bind(this,dataset)}>pageview</mui.IconButton>);
      if (dataset.owner === this.data.user.username) {
        buttons.push(<mui.IconButton key={0} tooltip="share" style={buttonStyle} iconStyle={iconStyle} iconClassName="material-icons" onClick={this._onShareClick.bind(this,dataset)}>share</mui.IconButton>);
      }
    }
    return buttons;
  },
  _getAvatar: function(styles,dataset) {
    var avIcon;
    switch (dataset.shareMode) {
      case "public":
        avIcon = "public";
        break;
      case "specific":
        if (dataset.owner === this.data.user.username) {
          avIcon = "person_add";
        } else {
          avIcon = "person_outline";
        }        
        break;
      default: 
        avIcon = "lock_outline";
        break;
    }
    return <mui.FontIcon style={styles.avatar} className="material-icons">{avIcon}</mui.FontIcon>;
  },
  render: function() {
    var styles = this._getStyles();
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
        var row;
        var buttons = this._getRowButtons(ds);
        var avatar = this._getAvatar(styles,ds);
        var keyDataRow = (
          <div key={ds.id} className="Grid" style={styles.row} key={ds.id} onMouseOver={this._onRowHover.bind(this,ds)} onClick={this._onRowSelection.bind(this,ds)}>
            <div className="Grid-cell" style={styles.nameColumn}>
              <div style={this.state.activeDataset === ds.id ? styles.nameColumnInnerActive : styles.nameColumnInner}>
                {avatar} {ds.name}
              </div>
            </div>
            <MediaQuery minWidth={900}>
              <div className="Grid-cell" style={styles.ownerColumn}>{ds.owner}</div>            
            </MediaQuery>
            <div className="Grid-cell"  style={styles.actionColumn}>{buttons}</div>
          </div>
        );          

        if (this.state.activeDataset === ds.id) {
          row = (
            <div>
              {keyDataRow}
              <div key={ds.id+"-active"} className="Grid" style={styles.description} onMouseOver={this._onRowHover.bind(this,ds)} onClick={this._onRowSelection.bind(this,ds)}>
                <div className="Grid-cell">
                  {ds.description}
                  <div style={styles.shareSummary}><nqmTBX.SharedWithSummary resource={ds} onClick={this._onShareClick.bind(this,ds)} /></div>
                </div>
              </div>
              <div className="Grid" style={styles.apiLink}>
                <div className="Grid-cell">
                  <mui.FontIcon style={styles.apiLinkIcon} className="material-icons">link</mui.FontIcon> <a href={"/api/datasets/" + ds.id} target="_blank" onClick={this._onAPIClick}>{"API Link"}</a>
                </div>
              </div>
            </div>
          );
        } else {
          row = keyDataRow;
        }
        datasetList.push(row);
      }, this);

      content = (
        <div className="" style={styles.datasetPanel}>
          <div className="Grid" style={styles.headerRow}>
            <div className="Grid-cell" style={{paddingLeft:30}}>name</div>
            <MediaQuery minWidth={900}>
              <div className="Grid-cell" style={styles.ownerColumn}>owner</div>
            </MediaQuery>
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
        {toolbar}
        {content}
      </div>
    );
  },
  _getStyles: function() {
    return styles = {
      datasetPanel: {
        marginTop: 60,
      },
      datasetList: {
        margin: 10,
      },
      toolbar: {
        paddingLeft: "4px",
        position: "fixed",
        backgroundColor: appPalette.primary3Color,
        zIndex: 1
      },
      headerRow: {
        padding: "4px 10px 4px 10px"
      },
      row: {
        height: "50px",
        lineHeight: "50px",
        verticalAlign: "middle",
        borderWidth: 0,
        borderTopWidth: 1,
        borderColor: appPalette.borderColor,
        borderStyle: "solid",
        padding: "4px 4px 4px 0px",
        color: appPalette.nqmTBXListTextColor,
        backgroundColor: appPalette.nqmTBXListBackground,
      },
      description: {
        padding: "4px 4px 8px 34px",
        color: appPalette.nqmTBXListTextColor,
        backgroundColor: appPalette.nqmTBXListBackground
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
      },
      actionColumn: {
        minWidth: 245,
        textAlign: "right"
      },
      avatar: {
        verticalAlign: "middle",
        color: appPalette.accent1Color,
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: "20px"
      },
      shareSummary: {
        paddingTop: 10
      },
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
      }
    };
  }
});