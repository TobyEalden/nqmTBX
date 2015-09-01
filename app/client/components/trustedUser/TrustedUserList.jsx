
const {
  FontIcon,
  CircularProgress,
  List,
  ListItem
  } = mui;

TrustedUserList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    var trustedSub = Meteor.subscribe("trustedUsers");

    return {
      ready: trustedSub.ready(),
      currentUser: Meteor.user(),
      trustedUsers: trustedUsers.find().fetch()
    }
  },
  deleteUser: function(id) {
    console.log("deleting share " + id);
  },
  render: function() {
    if (this.data.ready) {
      var trusted = this.data.trustedUsers.map(function (sh) {
        return <ListItem key={sh.id} primaryText={sh.userId} rightIcon={<FontIcon style={{verticalAlign: "middle"}} onClick={this.deleteUser.bind(this,sh.id)} className="material-icons">delete</FontIcon>} />;
      }, this);

      return (
        <List style={{width:"300px"}}>
          {trusted}
        </List>
      );
    } else {
      return <CircularProgress mode="indeterminate"/>;
    }
  }
});