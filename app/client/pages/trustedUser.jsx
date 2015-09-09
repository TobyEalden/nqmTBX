
nqmTBX.pages.TrustedUser = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState: function() {
    return {
      activeTab: "trustedByMe"
    }
  },
  getMeteorData: function() {
    var trustedSub = Meteor.subscribe("trustedUsers");

    return {
      ready: trustedSub.ready(),
      currentUser: Meteor.user(),
      trustedUsers: trustedUsers.find({status: {$in: ["trusted","pending","expired"]}}).fetch(),
      trustingUsers: trustedUsers.find({remoteStatus: {$in: ["trusted","pending","expired"]}}).fetch(),
    }
  },
  _onCreateUser: function() {
    var fields = this.refs.editTrustedUser.getData();
    if (!fields) {
      nqmTBX.ui.notification("please enter a valid e-mail address",6000);
    } else {
      var valid = {
        userId: fields.email,
        issued: moment().valueOf(),
        expires: nqmTBX.helpers.neverExpire.valueOf()
      };
      if (fields.server) {
        valid.server = fields.server;
      }
      if (fields.status) {
        valid.status = fields.status;
      }
      if (fields.remoteStatus) {
        valid.remoteStatus = fields.remoteStatus;
      }

      Meteor.call("/app/trustedUser/create", valid, nqmTBX.helpers.methodCallback("trustedUser/create"));
      this.refs.addUserDialog.dismiss();
    }
  },
  userInfo: function() {
    nqmTBX.ui.notification("not implemented");
  },
  addUser: function() {
    this.refs.addUserDialog.show();
  },
  deleteUser: function() {
    var sel;
    var list;
    if (this.state.activeTab === "trustedByMe") {
      sel = this.refs.trustedByMeList.getSelection();
      this.refs.trustedByMeList.clearSelection();
      list = this.data.trustedUsers;
    } else {
      sel = this.refs.trustingMeList.getSelection();
      this.refs.trustingMeList.clearSelection();
      list = this.data.trustingUsers;
    }
    if (sel.length == 0) {
      nqmTBX.ui.notification("select an item to delete",5000);
    } else {
      _.each(sel, function(i) {
        var id = list[i].id;
        console.log("deleting share " + id);
        Meteor.call("/app/trustedUser/delete",id,nqmTBX.helpers.methodCallback("trustedUser/delete"));
      }, this);
    }
  },
  _onTabChange: function(value,e,tab) {
    this.setState({activeTab: value });
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
      let createUserActions = [
        { text: 'cancel' },
        { text: 'add', onTouchTap: this._onCreateUser, ref: 'create' }
      ];
      var createUserDialog = (
        <mui.Dialog ref="addUserDialog" title="add zone connection" modal={true} actions={createUserActions} actionFocus="create">
          <nqmTBX.EditTrustedUser ref="editTrustedUser" />
        </mui.Dialog>
      );
      var trustedByMe = <nqmTBX.TrustedUserList ref="trustedByMeList" trustedUsers={this.data.trustedUsers} statusField="status" />;
      var trustingMe = <nqmTBX.TrustedUserList ref="trustingMeList" trustedUsers={this.data.trustingUsers} statusField="remoteStatus" />;
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
        <mui.Tabs onChange={this._onTabChange}>
          <mui.Tab value="trustedByMe" label="trusted by me">
            {toolbar}
            {trustedByMe}
            {createUserDialog}
          </mui.Tab>
          <mui.Tab value="trustingMe" label="trusting me">
            {toolbar}
            {trustingMe}
            {createUserDialog}
          </mui.Tab>
        </mui.Tabs>
      );
    } else {
      return <mui.CircularProgress mode="indeterminate" />;
    }
  }
});