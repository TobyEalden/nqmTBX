
nqmTBX.EditTrustedUser = React.createClass({
  getInitialState: function() {
    return {
      showTokenInputs: false,
      haveTokenText: false,
      gotTokenDetails: false,
      haveValidEmail: false,
      token: null
    }
  },
  getData: function() {
    if (!this.state.haveValidEmail) {
      return;
    }
    var data = {};
    if (this.state.gotTokenDetails) {
      // Details come from a token sent by another zone to indicate it trusts this zone.
      // This zone can now access resources in the other zone (with appropriate share permissions).
      data.remoteStatus = "trusted";        // This is implied -> the remote zone trusts us.
      data.email = this.state.token.sub;    // The token subject is the email of the remote zone.
      data.server = this.state.token.iss;   // The token issuer is the URI of the remote zone.
      // The user may have indicated that it trusts the remote zone in return.
      if (this.refs.trustingCheck.isChecked()) {
        data.status = "trusted";
      }
    } else {
      // Details were entered manually.
      data.email = this.refs.email.getValue();
      // The trust status is implied -> this zone trusts the remote zone.
      data.status = "trusted";
    }
    return data;
  },
  _onPasteToken: function() {
    this.setState({showTokenInputs: true});
  },
  _onTokenChange: function(e) {
    this.setState({haveTokenText: e.target.value.length > 0});
  },
  _onEmailChange: function(e) {
    this.setState({haveValidEmail: nqmTBX.helpers.isEmailValid(e.target.value), gotTokenDetails: (this.state.token && e.target.value === this.state.token.sub)});
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
            self.setState({gotTokenDetails: true, showTokenInputs: false, haveValidEmail: true, token: result.token});
            self.refs.email.setValue(result.token.sub);
          } else {
            nqmTBX.ui.notification("bad token");
          }
        }
      });
    }
  },
  render: function() {
    var pasteTokenButton, tokenInputFields, trustedByCheck, trustingCheck, emailField;
    if (this.state.showTokenInputs) {
      // Show the 'paste token' input field and lookup button.
      var tokenLookupButton;
      if (this.state.haveTokenText) {
        tokenLookupButton = <mui.RaisedButton onClick={this._onTokenLookup} label="get details" primary={true} />;
      }
      tokenInputFields = (<div><mui.TextField ref="token" hintText="paste token here" onChange={this._onTokenChange} /> {tokenLookupButton}</div>);
    } else {
      emailField = <mui.TextField ref="email" hintText="enter email" onChange={this._onEmailChange} />;
      if (!this.state.gotTokenDetails) {
        pasteTokenButton = <span>&nbsp; - OR - &nbsp;<mui.RaisedButton label="paste connect token" secondary={true} onClick={this._onPasteToken} /></span>;
      } else {
        trustedByCheck = <div><mui.Checkbox name="trusting" value="trusting" checked={true} disabled={true} label="This zone trusts me"/></div>;
      }
      if (this.state.haveValidEmail) {
        trustingCheck = <div><mui.Checkbox ref="trustingCheck" name="trusted" value="trusted" disabled={!this.state.gotTokenDetails} checked={!this.state.gotTokenDetails} label="I trust this zone"/></div>;
      }
    }
    return (
      <div>
        {tokenInputFields}
        {emailField} {pasteTokenButton}
        {trustedByCheck}
        {trustingCheck}
      </div>
    )
  }
});