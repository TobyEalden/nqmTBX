
nqmTBX.pages.ZoneConnections = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState: function() {
    return {
      activeTab: "trustedByMe"
    }
  },
  getMeteorData: function() {
    var trustedSub = Meteor.subscribe("zoneConnections");
    return {
      ready: trustedSub.ready(),
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
  userInfo: function() {
    var sel = this._getSelections();
    if (sel.selections.length === 0) {
      nqmTBX.ui.notification("select an item");
    } else {
      this.refs.detailsDialog.show();
    }
  },
  addUser: function() {
    this.refs.createDialog.show();
  },
  _getSelections: function() {
    var sel;
    var list;
    if (this.state.activeTab === "trustedByMe") {
      sel = this.refs.trustedByMeList.getSelection();
      list = this.data.trustedZones;
    } else {
      sel = this.refs.trustingMeList.getSelection();
      list = this.data.trustingZones;
    }
    return {
      selections: sel,
      list: list
    };
  },
  deleteUser: function() {
    var sel = this._getSelections();
    if (sel.selections.length == 0) {
      nqmTBX.ui.notification("select an item to delete",5000);
    } else {
      sel.list.clearSelection();

      _.each(sel.selections, function(i) {
        var id = sel.list[i].id;
        console.log("deleting share " + id);
        Meteor.call("/app/zoneConnection/delete",id,nqmTBX.helpers.methodCallback("zoneConnection/delete"));
      }, this);
    }
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
        <mui.Dialog ref="detailsDialog" title="zone connection details" modal={true} actions={[{text:"ok"},{text:"cancel"}]} actionFocus="create">
          <div>connection details</div>
        </mui.Dialog>
      );
      var trustedByMe = <nqmTBX.ZoneConnectionList ref="trustedByMeList" trustedZones={this.data.trustedZones} emailField="otherEmail" />;
      var trustingMe = <nqmTBX.ZoneConnectionList ref="trustingMeList" trustedZones={this.data.trustingZones} emailField="ownerEmail" />;
      var toolbar = (
        <mui.Toolbar style={styles.toolbar}>
          <mui.ToolbarGroup>
            <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this.addUser}>add</mui.FontIcon>
            <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this.userInfo}>info</mui.FontIcon>
          </mui.ToolbarGroup>
          <mui.ToolbarGroup float="right">
            <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this.deleteUser}>delete</mui.FontIcon>
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