UnauthLayout = React.createClass({
  mixins: [ ReactMeteorData ],
  getMeteorData: function() {
    var data = {
      loggingIn: Meteor.loggingIn(),
      loggedIn: Meteor.user() && Meteor.user().nqmId
    };
    return data;
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  render() {
    return (
      <mui.AppCanvas>
        <nqmTBX.TitleBar showSearch={false} showUserMenu={this.data.loggedIn} />
        <div style={{paddingTop:"100px"}} />
        {this.props.content()}
        <nqmTBX.Notification />
      </mui.AppCanvas>
    );
  }
});