

nqmTBX.pages.RequestAccessPage = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    jwt: React.PropTypes.string
  },
  getInitialState: function() {
    return null;
  },
  getMeteorData: function() {
    var data = {};
    var jwtSub = Meteor.subscribe("jwt", this.props.jwt);
    data.ready = jwtSub.ready();
    data.token = JWTokens.findOne({_id: this.props.jwt});
    return data;
  },
  requestAccess: function() {
    Meteor.call("/app/share/request",this.props.jwt,function(err) {
      if (err) {
        nqmTBX.ui.notification("failed to request access: " + err.message);
      } else {
        FlowRouter.go("/");
      }
    });
  },
  noThanks: function() {
    FlowRouter.go("/");
  },
  render: function() {
    var content;

    if (!this.data.ready) {
      content = <mui.CircularProgress mode="indeterminate" />;
    } else {
      content = (
        <mui.Card style={{margin:"40px", maxWidth:"300px"}}>
          <mui.CardTitle title="Request Access" subtitle="would you like to request access to this resource?" />
          <mui.CardText>
            Owner: {this.data.token.iss}<br />
            Resource: {this.data.token.sub}<br />
          </mui.CardText>
          <mui.CardActions>
            <mui.RaisedButton primary={true} label="request access" onClick={this.requestAccess} />
            <mui.RaisedButton label="no thanks" onClick={this.noThanks} />
          </mui.CardActions>
        </mui.Card>
      );
    }

    return content;
  }
});