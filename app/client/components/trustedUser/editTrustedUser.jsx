const {
  TextField,
  RaisedButton,
  Card,
  CardTitle,
  CardText,
  CardActions
  } = mui;

EditTrustedUser = React.createClass({
  save: function() {
    var cb = function(err, result) {
      if (result.error) {
        err = new Error(result.error);
      }
      if (err) {
        nqmTBX.ui.notification("save failed: " + err.message, 2000);
      }
      if (result && result.ok) {
        nqmTBX.ui.notification("command sent",2000);
        FlowRouter.go("/trusted");
      }
    };

    var expiryDays = 1;
    var valid = {
      id: Random.id(),
      userId: this.refs["email"].getValue(),
      userName: this.refs["username"].getValue(),
      issued: Date.now(),
      expires: Date.now() + expiryDays * 86400000,
      status: "trusted"
    };

    Meteor.call("/app/trustedUser/create", valid, cb);
  },
  render: function() {
    return (
      <Card zDepth={0}>
        <CardTitle title="trusted user details" />
        <CardText>
          <div><TextField ref="username" floatingLabelText="user name" /></div>
          <div><TextField ref="email" floatingLabelText="user email" /></div>
          <div><TextField ref="nqmId" floatingLabelText="nqm identifier (optional)" hintText="toby.nqminds.com" /></div>
        </CardText>
        <CardActions>
          <RaisedButton label="create" primary={true} onClick={this.save} />
        </CardActions>
      </Card>
    )
  }
});