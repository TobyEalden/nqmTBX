
nqmTBX.pages.TrustedUser = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    var trustedSub = Meteor.subscribe("trustedUsers");

    return {
      ready: trustedSub.ready(),
      currentUser: Meteor.user(),
      trustedUsers: trustedUsers.find().fetch()
    }
  },
  _onCreateUser: function() {
    var fields = this.refs.editTrustedUser.getData();
    var valid = {
      id: Random.id(),
      userId: fields.email,
      userName: fields.username,
      server: fields.nqmId,
      issued: moment().valueOf(),
      expires: nqmTBX.helpers.neverExpire.valueOf(),
      status: "trusted"
    };

    Meteor.call("/app/trustedUser/create", valid, nqmTBX.helpers.methodCallback("trustedUser/create"));
    this.refs.addUserDialog.dismiss();
  },
  userInfo: function() {
    nqmTBX.ui.notification("not implemented");
  },
  addUser: function() {
    this.refs.addUserDialog.show();
  },
  deleteUser: function() {
    var sel = this.refs.trustedByMe.getSelection();
    if (sel.length == 0) {
      nqmTBX.ui.notification("select an item to delete",5000);
    } else {
      _.each(sel, function(i) {
        var id = this.data.trustedUsers[i].id;
        console.log("deleting share " + id);
        Meteor.call("/app/trustedUser/delete",id,nqmTBX.helpers.methodCallback("trustedUser/delete"));
      }, this);
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
      let createUserActions = [
        { text: 'cancel' },
        { text: 'create', onTouchTap: this._onCreateUser, ref: 'create' }
      ];
      var createUserDialog = (
        <mui.Dialog ref="addUserDialog" title="add zone connection" modal={true} actions={createUserActions} actionFocus="create">
          <nqmTBX.EditTrustedUser ref="editTrustedUser" />
        </mui.Dialog>
      );
      var trustedByMe = <nqmTBX.TrustedUserList ref="trustedByMe" trustedUsers={this.data.trustedUsers} />;
//    var trustingMe = <nqmTBX.Trusted

      return (
        <mui.Tabs>
          <mui.Tab label="trusted by me">
            <mui.Toolbar style={styles.toolbar}>
              <mui.ToolbarGroup>
                <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this.addUser}>add</mui.FontIcon>
                <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this.userInfo}>info</mui.FontIcon>
              </mui.ToolbarGroup>
              <mui.ToolbarGroup float="right">
                <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this.deleteUser}>delete</mui.FontIcon>
              </mui.ToolbarGroup>
            </mui.Toolbar>
            {trustedByMe}
            {createUserDialog}
          </mui.Tab>
          <mui.Tab label="trusting me">
          </mui.Tab>
        </mui.Tabs>
      );
    } else {
      return <mui.CircularProgress mode="indeterminate" />;
    }
  }
});