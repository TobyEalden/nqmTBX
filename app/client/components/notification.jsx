
nqmTBX.Notification = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    var self = this;
    var data = {};
    var notificationQ = Session.get("nqm-ui-notification") || [];
    if (notificationQ.length > 0 && !Session.get("nqm-ui-notification-busy")) {
      var msg = notificationQ.splice(0,1);
      Session.set("nqm-ui-notification",notificationQ);
      if (msg.length > 0 && self.refs.snackBar) {
        data.notificationMsg = msg[0].msg;
        data.notificationDuration = msg[0].delay;
        Session.set("nqm-ui-notification-msg", data.notificationMsg);
        Session.set("nqm-ui-notification-duration", data.notificationDuration);
        Session.set("nqm-ui-notification-busy", true);
        self.refs.snackBar.show();
        //setTimeout(function() {
        //  if (self.refs.snackBar) {
        //    self.refs.snackBar.show();
        //  }
        //},0);
      } else {
      }
    } else {
      data.notificationMsg = Session.get("nqm-ui-notification-msg");
      data.notificationDuration = Session.get("nqm-ui-notification-duration");
    }

    return data;
  },
  componentDidMount: function() {
    Session.set("nqm-ui-notification-busy",false);
  },
  onSnackbarDismiss: function() {
    var notificationQ = Session.get("nqm-ui-notification") || [];
    if (notificationQ.length === 0) {
      Session.set("nqm-ui-notification-showing",false);
    }
    Session.set("nqm-ui-notification-msg",null);
    Session.set("nqm-ui-notification-busy", false);
  },
  render: function() {
    var styles = {
      snackBar: {
        fontFamily: ThemeManager.getCurrentTheme().contentFontFamily
      }
    };
    return <mui.Snackbar style={styles.snackBar} ref="snackBar" message={this.data.notificationMsg || ""} autoHideDuration={this.data.notificationDuration} onDismiss={this.onSnackbarDismiss} />
  }
});