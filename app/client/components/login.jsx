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

    return (
      <div style={{paddingTop: Styles.Spacing.desktopKeylineIncrement*2}} className="Grid">
        <div className="Grid-cell"></div>
        <Card className="Grid-cell" style={{width: 250, flex: "none" }}>
          <CardTitle title={<span><span style={styles.nquiring}>nquiring</span><span style={styles.minds}>Toolbox</span></span>}/>
          <CardText>
          </CardText>
          <CardActions style={{textAlign: "center"}}>
            <RaisedButton label="Login with Google" primary={true} onClick={this.doLogin} />
            <RaisedButton label="NQM Login" secondary={true} onClick={this.doNQMLogin} />
          </CardActions>
        </Card>
        <div className="Grid-cell"></div>
      </div>
    )
  }
});
