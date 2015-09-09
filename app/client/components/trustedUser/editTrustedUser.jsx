
nqmTBX.EditTrustedUser = React.createClass({
  getInitialState: function() {
    return {
      showTokenEntry: false,
      showLookupButton: false,
      gotTokenDetails: false,
      showTrustingCheck: false,
      token: null
    }
  },
  getData: function() {
    var data = {};
    if (this.state.gotTokenDetails) {
      data.email = this.state.token.sub;
      data.server = this.state.token.iss;
      data.remoteStatus = "trusted";
      if (this.refs.trustingCheck.isChecked()) {
        data.status = "trusted";
      }
    } else {
      data.email = this.refs.email.getValue();
      data.status = this.refs.trustingCheck.isChecked() ? "trusted": "pending";
    }
    return data;
  },
  _onPasteToken: function() {
    this.setState({showTokenEntry: true});
  },
  _onTokenChange: function(e) {
    this.setState({showLookupButton: e.target.value.length > 0});
  },
  _onEmailChange: function(e) {
    this.setState({showTrustingCheck: nqmTBX.helpers.isEmailValid(e.target.value), gotTokenDetails: (this.state.token && e.target.value === this.state.token.sub)});
  },
  _onTokenLookup: function() {
    var self = this;
    var token = this.refs.token.getValue();
    if (token.length > 0) {
      Meteor.call("/app/token/lookup",token,function(err,result) {
        if (err) {
          nqmTBX.ui.notification(err.message);
        } else {
          if (result.token.sub.length > 0) {
            self.setState({gotTokenDetails: true, showTokenEntry: false, showTrustingCheck: true, token: result.token});
            self.refs.email.setValue(result.token.sub);
          } else {
            nqmTBX.ui.notification("bad token");
          }
        }
      });
    }
  },
  render: function() {
    var showTokenButton, showTokenDetails, trustedByCheck, trustingCheck, emailField;
    if (this.state.showTokenEntry) {
      var showLookupButton = this.state.showLookupButton ? (<mui.RaisedButton onClick={this._onTokenLookup} label="get details" primary={true} />) : (<span></span>);
      showTokenDetails = (
        <div>
          <div><mui.TextField ref="token" hintText="paste token here" onChange={this._onTokenChange} /> {showLookupButton}</div>
        </div>
      );
    } else {
      emailField = <mui.TextField ref="email" hintText="enter email" onChange={this._onEmailChange} />;
      if (this.state.showTrustingCheck) {
        trustingCheck = <div><mui.Checkbox ref="trustingCheck" name="trusted" value="trusted" label="I trust this zone"/></div>;
      }
      if (!this.state.gotTokenDetails) {
        showTokenButton = <span>&nbsp; OR &nbsp;<mui.RaisedButton label="paste connect token" secondary={true} onClick={this._onPasteToken} /></span>;
      } else {
        trustedByCheck = <div><mui.Checkbox name="trusting" value="trusting" checked={true} disabled={true} label="This zone trusts me"/></div>;
      }
    }
    return (
      <div>
        {showTokenDetails}
        <div>{emailField} {showTokenButton}</div>
        {trustedByCheck}
        {trustingCheck}
        {/*
         <div><mui.Checkbox name="trusted" value="trusted" label="I trust this zone"/></div>
         <div><mui.Checkbox name="trusting" value="trusting" label="This zone trusts me"/></div>
         <div><mui.TextField ref="username" floatingLabelText="user name (optional)" /></div>
         <div><mui.TextField ref="nqmId" floatingLabelText="nqm identifier (optional)" hintText="toby.nqminds.com" /></div>
        */}
      </div>
    )
  }
});