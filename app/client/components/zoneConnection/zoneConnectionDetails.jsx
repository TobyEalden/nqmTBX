
nqmTBX.ZoneConnectionDetails = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      user: Meteor.user()
    }
  },
  propTypes: {
    connection: React.PropTypes.object
  },
  render: function() {
    var description = [];
    if (this.props.connection.status === "expired") {
      description.push(<p>{"This connection has expired"}</p>);
    } else {
      var trusted = this.props.connection.status === "trusted";
      var owner = this.props.connection.owner === this.data.user.username;
      if (owner) {
        description.push(<p>{"You are trusting zone '" + this.props.connection.otherEmail + "'."}</p>);
      } else {
        description.push(<p>{"Zone '" + this.props.connection.ownerEmail + "' trusts you."}</p>);
      }
      if (!trusted) {
        // Not trusted.
        if (owner) {
          description.push(<p>{"Waiting for '" + this.props.connection.otherEmail + "' to accept the connection."}</p>);
        } else {
          description.push(<p>{"'" + this.props.connection.ownerEmail + "' is waiting for you to accept the connection."}</p>);
        }
      }
    }
    return (
      <div>{description}</div>
    );
  }
});