const {
  AppCanvas,
  AppBar,
  TextField,
  Styles,
  Card,
  CardHeader,
  CardText,
  CardActions,
  CardTitle,
  RaisedButton
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();

Login = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      user: Meteor.user()
    }
  },
  logout: function() {
    nqmTBX.helpers.logout();
  },
  doLogin: function() {
    Meteor.loginWithGoogle({ prompt: "select_account consent" }, function(err) {
      if (!err) {
        nqmTBX.ui.notification("logged in");
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
  createAccount: function() {
    var accountName = this.refs["accountName"].getValue();
    Meteor.call("/app/account/create", accountName, function(err, result) {
      if (result.error) {
        err = new Error(result.error);
      }
      if (err) {
        nqmTBX.ui.notification("create account failed: " + err.message);
      }
      if (result && result.ok) {
        nqmTBX.ui.notification("account created");
      }
    });
  },
  render: function () {
    var styles = {
      nquiring: {
        fontWeight: "lighter",
        paddingRight: "0px",
        color: ThemeManager.getCurrentTheme().palette.textColor
      },
      toolbox: {
        fontWeight: "bolder",
        color: ThemeManager.getCurrentTheme().palette.textColor
      },
    };

    var content;
    if (this.data.user) {
      if (this.data.user.nqmId) {
        content = <div>logged in!</div>;
      } else {
        content = <div>
          <CardTitle title="create an nqminds account" />
          <CardText>
            <TextField ref="accountName" floatingLabelText="nqm id" value={this.data.user.profile.name.replace(/ /g,".")} />
          </CardText>
          <CardActions>
            <RaisedButton label="create account" primary={true} onClick={this.createAccount} />
            <RaisedButton label="logout" onClick={this.logout} style={{float: "right"}} />
          </CardActions>
        </div>;
      }
    } else {
      content = <div>
          <CardTitle title={<span><span style={styles.nquiring}>nquiring</span><span style={styles.minds}>Toolbox</span></span>}/>
          <CardText>
          </CardText>
          <CardActions style={{textAlign: "center"}}>
            <RaisedButton label="Login with Google" primary={true} onClick={this.doLogin} />
            {/*<RaisedButton label="NQM Login" secondary={true} onClick={this.doNQMLogin} />*/}
          </CardActions>
        </div>;
    }

    return (
      <div style={{paddingTop: Styles.Spacing.desktopKeylineIncrement*2}} className="Grid">
        <div className="Grid-cell"></div>
        <Card className="Grid-cell" style={{width: 300, flex: "none" }}>
          {content}
        </Card>
        <div className="Grid-cell"></div>
      </div>
    )
  }
});
