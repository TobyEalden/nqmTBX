

nqmTBX.pages.RequestAccessPage = React.createClass({
  render: function() {
    return (
        <mui.Card style={{margin:"40px", maxWidth:"300px"}}>
          <mui.CardTitle title="Request Access" subtitle="would you like to request access to this resource?" />
          <mui.CardActions>
            <mui.RaisedButton primary={true} label="request access" />
            <mui.RaisedButton label="no thanks" />
          </mui.CardActions>
        </mui.Card>
    );
  }
});