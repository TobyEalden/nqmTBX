
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
      trustedZones: zoneConnections.find({owner: Meteor.user().username}).fetch(),
      trustingZones: zoneConnections.find({$or: [{other: Meteor.user().username},{otherEmail: Meteor.user().email }]}).fetch(),
    }
  },
  _onCreateConnection: function() {
    var fields = this.refs.editTrustedUser.getData();
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
  },
  _trustBack: function(conn) {
    Meteor.call("/app/zoneConnection/create", {otherEmail: conn.ownerEmail}, nqmTBX.helpers.methodCallback("createZoneConnection"));
  },
  _showConnectionInfo: function(selectedConnection) {
    var buttons = [];
    if (selectedConnection.owner !== this.data.user.username) {
      if (!zoneConnections.findOne({ owner: this.data.user.username, otherEmail: selectedConnection.ownerEmail })) {
        buttons.push({text: "trust back", onTouchTap: this._trustBack.bind(this,selectedConnection) });
      }
      if (selectedConnection.status !== "trusted") {
        buttons.push({text: "accept", onTouchTap: this._acceptConnection.bind(this,selectedConnection) });
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
      toolbar: {
        paddingLeft: "4px"
      },
      iconButton: {
        color: "white",
        hoverColor: "white"
      }
    };

    if (this.data.ready) {
      let addCancelButtons = [
        { text: 'cancel' },
        { text: 'add', onTouchTap: this._onCreateConnection, ref: 'create' }
      ];
      var createConnectionDialog = (
        <mui.Dialog ref="createDialog" title="add zone connection" modal={true} actions={addCancelButtons} actionFocus="create">
          <nqmTBX.CreateZoneConnection ref="editTrustedUser" />
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
            <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this._onAddUser}>add</mui.FontIcon>
          </mui.ToolbarGroup>
        </mui.Toolbar>
      ) ;

      return (
        <div>
          <mui.Tabs onChange={this._onTabChange}>
            <mui.Tab value="trustedByMe" label="trusted by me">
              {toolbar}
              {trustedByMe}
            </mui.Tab>
            <mui.Tab value="trustingMe" label="trusting me">
              {toolbar}
              {trustingMe}
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