
nqmTBX.pages.ZoneConnections = React.createClass({
  mixins: [ReactMeteorData],
  childContextTypes: {
    onAccept: React.PropTypes.func,
    onRemove: React.PropTypes.func,
    onInfo: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      activeTab: "trustedByMe",
      selectedConnection: null,
      connectionButtons: []
    }
  },
  getChildContext: function() {
    return {
      onAccept: this._acceptConnection,
      onRemove: this._deleteSingleConnection,
      onInfo: this._showConnectionInfo
    };
  },
  getMeteorData: function() {
    var trustedSub = Meteor.subscribe("zoneConnections");
    return {
      ready: trustedSub.ready(),
      user: Meteor.user(),
      trustedZones: zoneConnections.find({owner: Meteor.user().username, otherEmail: {$ne: Meteor.user().email} }).fetch(),
      trustingZones: zoneConnections.find({$or: [{other: Meteor.user().username},{otherEmail: Meteor.user().email }]}).fetch(),
      marginLeft: Session.get("nqm-sidebar-open") ? "200px" : "0px"
    }
  },
  _onCreateConnection: function() {
    var fields = this.refs.createZoneConnection.getData();
    if (!fields) {
      nqmTBX.ui.notification("please enter a valid e-mail address",6000);
    } else {
      if (fields.response) {
        Meteor.call("/app/zoneConnection/accept", fields.response, nqmTBX.helpers.methodCallback("updateZoneConnection"));
      }
      if (fields.request) {
        Meteor.call("/app/zoneConnection/create", fields.request, nqmTBX.helpers.methodCallback("createZoneConnection"));
      }
      this.refs.createDialog.dismiss();
    }
  },
  _acceptConnection: function(conn) {
    Meteor.call("/app/zoneConnection/accept", { id: conn.id }, nqmTBX.helpers.methodCallback("updateZoneConnection"));
    this.refs.detailsDialog.dismiss();
  },
  _trustBack: function(conn) {
    Meteor.call("/app/zoneConnection/accept", { id: conn.id }, nqmTBX.helpers.methodCallback("updateZoneConnection"));
    Meteor.call("/app/zoneConnection/create", {otherEmail: conn.ownerEmail}, nqmTBX.helpers.methodCallback("createZoneConnection"));
    this.refs.detailsDialog.dismiss();
  },
  _showConnectionInfo: function(selectedConnection) {
    // TODO - figure out why RaisedButton doesn't work.
    //var buttons = [];
    //if (selectedConnection.owner !== this.data.user.username) {
    //  if (selectedConnection.status !== "trusted") {
    //    buttons.push(<mui.RaisedButton key={0} label="accept" primary={true} onClick={this._acceptConnection.bind(this,selectedConnection)} />);
    //  }
    //  if (!zoneConnections.findOne({ owner: this.data.user.username, otherEmail: selectedConnection.ownerEmail })) {
    //    buttons.push(<mui.RaisedButton key={1} label="accept and trust back" primary={true} onClick={this._trustBack.bind(this,selectedConnection)} />);
    //  }
    //}
    //buttons.push(<mui.RaisedButton key={2} label="remove" onClick={this._deleteSingleConnection.bind(this,selectedConnection)} />);
    //buttons.push(<mui.RaisedButton key={3} label="ok" />);
    var buttons = [];
    if (selectedConnection.owner !== this.data.user.username) {
      if (selectedConnection.status === "issued") {
        buttons.push({text: "accept", onTouchTap: this._acceptConnection.bind(this,selectedConnection) });
      }
      if (!zoneConnections.findOne({ owner: this.data.user.username, otherEmail: selectedConnection.ownerEmail })) {
        buttons.push({text: "accept and trust back", onTouchTap: this._trustBack.bind(this,selectedConnection) });
      }
    }
    buttons.push({text: "remove", onTouchTap: this._deleteSingleConnection.bind(this,selectedConnection) });
    buttons.push({text: "ok"});
    this.setState({
      connectionButtons: buttons,
      selectedConnection: selectedConnection
    });
    this.refs.detailsDialog.show();
  },
  _deleteSingleConnection: function(conn) {
    console.log("deleting connection " + conn.id);
    Meteor.call("/app/zoneConnection/delete",conn.id,nqmTBX.helpers.methodCallback("zoneConnection/delete"));
    this.refs.detailsDialog.dismiss();
  },
  _onAddUser: function() {
    this.refs.createDialog.show();
  },
  _onTabChange: function(value,e,tab) {
    if (tab) {
      this.setState({activeTab: value });
    }
  },
  render: function() {
    var styles = {
      iconButton: {
        color: "white",
        hoverColor: "white"
      },
      tabs: {
        position: "absolute",
        left: this.data.marginLeft,
        right: 0,
        top: 56,
        bottom: 0        
      },
      tabContent: {
        overflowY: "auto",
        height: "300px"
      },
      tab: {
        backgroundColor: appPalette.primary3Color,
        position: "static",
        // position: "absolute",
        // top: "0px",
        // right: "0px",
        // bottom: "0px",
        // left: 0
      },
      toolbar: {
        width: "auto",
        paddingLeft: "4px"
      }
    };

    if (this.data.ready) {
      let addCancelButtons = [
        { text: 'cancel' },
        { text: 'add', onTouchTap: this._onCreateConnection, ref: 'create' }
      ];
      var createConnectionDialog = (
        <mui.Dialog ref="createDialog" title="add zone connection" modal={true} actions={addCancelButtons} actionFocus="create">
          <nqmTBX.CreateZoneConnection ref="createZoneConnection" />
        </mui.Dialog>
      );
      var detailsDialog = (
        <mui.Dialog ref="detailsDialog" title="zone connection details" modal={true} actions={this.state.connectionButtons} actionFocus="create">
          <nqmTBX.ZoneConnectionDetails connection={this.state.selectedConnection} />
        </mui.Dialog>
      );
      var trustedByMe = <nqmTBX.ZoneConnectionList ref="trustedByMeList" trustedZones={this.data.trustedZones} emailField="otherEmail" />;
      var trustingMe = <nqmTBX.ZoneConnectionList ref="trustingMeList" trustedZones={this.data.trustingZones} emailField="ownerEmail" />;
      var toolbar = (
        <mui.Toolbar style={styles.toolbar}>
          <mui.ToolbarGroup>
            <mui.FontIcon color={appPalette.textColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this._onAddUser}>add</mui.FontIcon>
          </mui.ToolbarGroup>
        </mui.Toolbar>
      ) ;

      return (
        <div className="nqm-page-content">
          <mui.Tabs style={styles.tabs} onChange={this._onTabChange}>
            <mui.Tab value="trustedByMe" label="zones you trust" style={styles.tab}>
              {toolbar}
              <div className="nqm-tab-content" style={styles.tabContent}>
                {trustedByMe}
              </div>
            </mui.Tab>
            <mui.Tab value="trustingMe" label="zones that trust you" style={styles.tab}>
              {toolbar}
              <div className="nqm-tab-content-2" style={styles.tabContent}>
                {trustingMe}
              </div>              
            </mui.Tab>
          </mui.Tabs>
          {createConnectionDialog}
          {detailsDialog}
        </div>
      );
    } else {
      return <mui.CircularProgress mode="indeterminate" />;
    }
  }
});