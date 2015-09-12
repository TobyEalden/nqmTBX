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
      hoveredRow: -1,
      hoveredDataset: null
    }
  },
  _onAddDataset: function() {
    FlowRouter.go("datasetCreate");
  },
  _onShareClick: function(dataset, e) {

  },
  _onEditClick: function(dataset, e) {

  },
  _onDeleteClick: function(dataset, e) {

  },
  _onSelection: function(selectedRows) {
    nqmTBX.ui.notification("selected!");
  },
  _rowHoverTimer: 0,
  _onRowHover: function(rowNumber) {
    console.log("hovered entry: " + rowNumber);
    this.setState({ hoveredDataset: this.data.datasets[rowNumber].id });
  },
  _onRowHoverExit: function() {
    console.log("hovered exit");
    clearTimeout(this._rowHoverTimer);
    this.setState({ hoveredDataset: null });
  },
  _getRowButtons: function(dataset) {
    var buttons = [];
    var buttonStyle = {
      float: "right"
    };
    if (this.state.hoveredDataset === dataset.id) {
      buttons.push(<mui.IconButton key={3} style={buttonStyle} iconClassName="material-icons" onClick={this._onEditClick.bind(this,dataset)}>more_vert</mui.IconButton>);
      buttons.push(<mui.IconButton key={2} style={buttonStyle} iconClassName="material-icons" onClick={this._onDeleteClick.bind(this,dataset)}>delete</mui.IconButton>);
      buttons.push(<mui.IconButton key={1} style={buttonStyle} iconClassName="material-icons" onClick={this._onEditClick.bind(this,dataset)}>edit</mui.IconButton>);
      if (dataset.owner === this.data.user.username) {
        buttons.push(<mui.IconButton key={0} style={buttonStyle} iconClassName="material-icons" onClick={this._onShareClick.bind(this,dataset)}>share</mui.IconButton>);
      }
    }
    return buttons;
  },
  render: function() {
    var styles = {
      root: {
      },
      datasetPanel: {
        paddingTop: 60,
      },
      datasetList: {
        //height: "100%",
        //width: "100%",
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
      },
      nameColumn: {
        width: "33%",
        textAlign: "left"
      },
      ownerColumn: {
        textAlign: "left"
      },
      modifiedColumn: {
        textAlign: "left"
      },
      actionColumn: {
        width: 192,
        textAlign: "right"
      }
    };
    var toolbar = (
      <mui.Toolbar style={styles.toolbar} zDepth={2}>
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
          <mui.TableRow key={ds.id}>
            <mui.TableRowColumn style={styles.nameColumn}>{ds.name}</mui.TableRowColumn>
            <mui.TableRowColumn style={styles.ownerColumn}>{ds.owner}</mui.TableRowColumn>
            <mui.TableRowColumn style={styles.modifiedColumn}>{}</mui.TableRowColumn>
            <mui.TableRowColumn style={styles.actionColumn}>{buttons}</mui.TableRowColumn>
          </mui.TableRow>
        );
        datasetList.push(row);
      }, this);

      content = (
        <mui.Table ref="table" selectable={true} fixedHeader={true} onRowSelection={this._onSelection} onRowHover={this._onRowHover} onRowHoverExit={this._onRowHoverExit}>
          <mui.TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <mui.TableRow>
              <mui.TableHeaderColumn style={styles.nameColumn}>name</mui.TableHeaderColumn>
              <mui.TableHeaderColumn style={styles.ownerColumn}>owner</mui.TableHeaderColumn>
              <mui.TableHeaderColumn style={styles.modifiedColumn}>modified</mui.TableHeaderColumn>
              <mui.TableHeaderColumn style={styles.actionColumn}>actions</mui.TableHeaderColumn>
            </mui.TableRow>
          </mui.TableHeader>
          <mui.TableBody deselectOnClickaway={false} displayRowCheckbox={false} showRowHover={true}>
            {datasetList}
          </mui.TableBody>
        </mui.Table>
      );
    } else {
      content = <mui.CircularProgress mode="indeterminate" />;
    }

    return (
      <div style={styles.root}>
        {toolbar}
        <div style={styles.datasetPanel}>
          <div style={styles.datasetList}>
            {content}
          </div>
        </div>
      </div>
    );
  }
});