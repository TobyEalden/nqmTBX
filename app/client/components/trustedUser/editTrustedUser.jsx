
nqmTBX.EditTrustedUser = React.createClass({
  getData: function() {
    return {
      username: this.refs.username.getValue(),
      email: this.refs.email.getValue(),
      nqmId: this.refs.nqmId.getValue()
    }
  },
  render: function() {
    return (
      <div>
        <div><mui.TextField ref="email" floatingLabelText="email OR connection token" /></div>
        <div><mui.TextField ref="username" floatingLabelText="user name (optional)" /></div>
        <div><mui.TextField ref="nqmId" floatingLabelText="nqm identifier (optional)" hintText="toby.nqminds.com" /></div>
      </div>
    )
  }
});