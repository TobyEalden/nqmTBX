
ModalLayout = React.createClass({
  mixins: [ ReactMeteorData ],
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getMeteorData: function() {
    var data = {
      loggingIn: Meteor.loggingIn(),
      loggedIn: (Meteor.user() && Meteor.user().nqmId ? true : false)
    };

    return data;
  },
  getInitialState: function() {
    return { }
  },
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  logout: function() {
    nqmTBX.helpers.logout();
  },
  getContent: function(styles) {
    return (
      <div style={{height:"100%"}}>
        <nqmTBX.TitleBar showBack={true} showSearch={false} showUserMenu={this.data.loggedIn} />
        <div className="nqm-below-header">
          { this.props.content() }
        </div>
      </div>
    );
  },
  render: function() {
    var styles = {
      body: {
        backgroundColor:  appPalette.accent3Color
      },
    };

    var content;
    if (this.data.loggingIn) {
      content = <mui.CircularProgress mode="indeterminate" />;
    } else if (this.data.loggedIn) {
      content = this.getContent(styles);
    } else {
      content = <nqmTBX.auth.Login />;
    }
    return (
      <div className="nqm-full-page" style={styles.body}>
        {content}
        <nqmTBX.Notification />
      </div>
    );
  }
});
