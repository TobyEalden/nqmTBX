nqmTBX.auth.Login = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    allowCreate: React.PropTypes.bool
  },
  getMeteorData: function() {
    return {
      user: Meteor.user(),
      loggedIn: Meteor.userId() != null
    }
  },
  render: function () {
    var content;
    if (this.data.user) {
      if (this.data.user.nqmId || !this.props.allowCreate) {
        // User is logged in with a valid nqm account (or account creation is disabled).
        // At this point the layout should re-render with authenticated account.
        content = (
          <div style={{textAlign:"center"}}>
            <mui.CircularProgress mode="indeterminate" />
          </div>);
      } else {
        // User is logged in, but has no nqm account.
        content = <nqmTBX.auth.CreateAccount user={this.data.user} />;
      }
    } else {
      // Not logged in.
      content = <nqmTBX.auth.Authenticate />;
    }

    return (
        <div style={{paddingTop: mui.Styles.Spacing.desktopKeylineIncrement*2}} className="Grid">
          <div className="Grid-cell"></div>
          <mui.Card className="Grid-cell" style={{width: 300, flex: "none" }} zDepth={0}>
            {content}
          </mui.Card>
          <div className="Grid-cell"></div>
        </div>
    )
  }
});

nqmTBX.auth.Authenticate = React.createClass({
  doGoogleLogin: function() {
    Meteor.loginWithGoogle({ prompt: "select_account consent" }, function(err) {
      if (!err) {
        nqmTBX.ui.notification("logged in");
      } else {
        nqmTBX.ui.notification(err.message);
      }
    });
  },
  doNQMLogin: function() {
    var config = {
      'client_id': '1051724674890-6qk768hmaatgl2810lc4n9qbns08emqh.apps.googleusercontent.com',
      'scope': 'https://www.googleapis.com/auth/userinfo.profile'
    };
    gapi.auth.authorize(config, function() {
      console.log('login complete');
      console.log(gapi.auth.getToken());
      Meteor.loginWithNQM("google", gapi.auth.getToken().access_token, function(err) {
        console.log("logged in with NQM!!!!");
      });
    });
  },
  render: function() {
    var content = (
      <div>
        <mui.CardText style={{textAlign: "center"}}>
          w h o &nbsp; a r e &nbsp; y o u ?
        </mui.CardText>
        <mui.CardActions style={{textAlign: "center"}}>
          <mui.RaisedButton label="Login with Google" primary={true} onClick={this.doGoogleLogin} /><br /><br />
          <mui.RaisedButton label="Login with Facebook" disabled={true} secondary={true} onClick={this.doFacebookLogin} /><br /><br />
          <mui.RaisedButton label="Login with Twitter" disabled={true} secondary={true} onClick={this.doTwitterLogin} /><br /><br />
          {/*<RaisedButton label="NQM Login" secondary={true} onClick={this.doNQMLogin} />*/}
        </mui.CardActions>
      </div>
    );

    return content;
  }
});

nqmTBX.auth.CreateAccount = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired
  },
  logout: function() {
    nqmTBX.helpers.logout();
  },
  createAccount: function() {
    var accountName = this.refs["accountName"].getValue();
    Meteor.call("/app/account/create", accountName, function(err, result) {
      if (result.error) {
        err = new Error(result.error);
      }
      if (err) {
        nqmTBX.ui.notification("create account failed: " + err.message, 15000);
      }
      if (result && result.ok) {
        nqmTBX.ui.notification("account created");
      }
    });
  },
  render: function() {
    var content = (<div>
      <mui.CardTitle title="create account" />
      {/*<mui.CardHeader title="choose username" avatar={<mui.FontIcon style={{fontSize:"36px"}} className="material-icons">face</mui.FontIcon>} />*/}
      <mui.CardText>
        <p>Choose a name to identify yourself on the nquiring<span style={{fontWeight:"bolder"}}>Minds</span> platform.</p>
        <mui.TextField ref="accountName" floatingLabelText="username" defaultValue={this.props.user.profile.name.replace(/ /g,".")} />
      </mui.CardText>
      <mui.CardActions style={{textAlign:"center"}}>
        <mui.RaisedButton label="create account" primary={true} onClick={this.createAccount} />
      </mui.CardActions>
    </div>);

    return content;
  }
});