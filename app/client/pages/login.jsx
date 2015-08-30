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

LoginPage = React.createClass({
  render: function() {
    return (
      <AppCanvas>
        <AppBar ref="appBar" showMenuIconButton={false} title="nquiringToolbox" />
        <div style={{paddingTop: Styles.Spacing.desktopKeylineIncrement*2}} className="Grid">
          <div className="Grid-cell"></div>
          <Card className="Grid-cell" style={{minWidth: 300 }}>
            <CardTitle title="Login" />
            <form>
              <CardText>
                <div>
                  <TextField hintText="email" floatingLabelText="email" />
                </div>
                <div>
                  <TextField type="password" hintText="password" floatingLabelText="Password" />
                </div>
              </CardText>
              <CardActions>
                <RaisedButton label="Login" primary={true} />
              </CardActions>
            </form>
          </Card>
          <div className="Grid-cell"></div>
        </div>
      </AppCanvas>
    )
  }
});
