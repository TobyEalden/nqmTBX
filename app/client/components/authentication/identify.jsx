

Identify = React.createClass({
  render: function() {
    return (
      <form>
        <CardText>
          <div>
            <TextField hintText="email" floatingLabelText="email"/>
          </div>
          <div>
            <TextField type="password" hintText="password" floatingLabelText="Password"/>
          </div>
        </CardText>
        <CardActions>
          <RaisedButton label="Login" primary={true} onClick={this.doLogin} />
        </CardActions>
      </form>
    )
  }
});