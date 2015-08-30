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
          </CardActions>
        </Card>
        <div className="Grid-cell"></div>
      </div>
    )
  }
});
