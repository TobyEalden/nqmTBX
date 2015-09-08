const {
  RaisedButton,
  Card,
  CardTitle,
  CardText,
  CardActions
  } = mui;

TrustedUserPage = React.createClass({
  render: function() {
   return (
     <Card zDepth={0}>
       <CardTitle title="trusted users" />
       <CardText>
         <TrustedUserList />
       </CardText>
       <CardActions>
         <RaisedButton primary={true} label="new trusted user" linkButton={true} href="/createTrustedUser" />
       </CardActions>
     </Card>
   )
  }
});