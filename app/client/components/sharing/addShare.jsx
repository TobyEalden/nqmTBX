
nqmTBX.AddShare = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    resource: React.PropTypes.object.isRequired,
    showExpiry: React.PropTypes.bool
  },
  getDefaultProps: function() {
    return { showExpiry: false }
  },
  getInitialState: function() {
    return {
      trustedMatch: [],
      expiryValue: "3600"
    }
  },
  getMeteorData: function() {
    var trustedSub = Meteor.subscribe("trustedUsers");
    return {
      ready: trustedSub.ready(),
      currentUser: Meteor.user()
    }
  },
  findUser: function(e) {
    var lookup = e.target.value;
    if (lookup.length > 0) {
      var searchTerm = new RegExp(lookup,"gi");
      this.setState({ trustedMatch: trustedUsers.find({  userId: searchTerm, status: "trusted", expires: {$gt: new Date() }}).fetch()});
    } else {
      this.setState({ trustedMatch: []});
    }
  },
  onMatchSelected: function(e) {
    this.refs["search"].setValue(e.target.innerText);
    this.setState({trustedMatch:[]});
  },
  expiryValueChange: function(e) {
    this.setState({expiryValue: e.target.value});
  },
  addUser: function() {
    var cb = function(err, result) {
      if (err) {
        nqmTBX.ui.notification("share failed: " + err.message);
      }
      if (result && result.ok) {
        nqmTBX.ui.notification("command sent, " + result.result.id);
      }
    };
    var params = {
      userId: this.refs["search"].getValue(),
      scope: this.props.resource.id,
      access: "read"
    };
    if (this.refs.expiry) {
      params.expires = this.state.expiryValue;
    } else {
      params.expires = -1;
    }
    if (params.expiry <= 0) {
      params.expiry = moment().add(999,"years");
    }

    Meteor.call("/app/share/create", params, cb);
    this.refs["search"].setValue("");
  },
  expiryOptions:  [
    { payload: '10', text: '10 Mins' },
    { payload: '60', text: '1 hour' },
    { payload: '1440', text: '1 day' },
    { payload: '10080', text: '1 week' },
    { payload: '43680', text: '1 month' },
    { payload: '524160', text: '1 year' },
    { payload: '-1', text: 'never' }
  ],
  render: function() {
    var styles = {
      root: {
        padding: "10px",
      },
      selectField: {
      }
    };
    var trustedMatches = this.state.trustedMatch.map(function (tm) {
      return <mui.ListItem key={tm.id} primaryText={tm.userId}
                       onClick={this.onMatchSelected}/>
    }, this);

    var expiry;
    if (this.props.showExpiry) {
      expiry = (
          <mui.SelectField
            ref="expiry"
            floatingLabelText="expiry"
            onChange={this.expiryValueChange}
            value={this.state.expiryValue}
            style={styles.selectField}
            hintText="expiry"
            menuItems={this.expiryOptions}/>
      );
    }

    var content = (
      <mui.Paper style={styles.root} zDepth={1}>
        <h4>add people</h4>
        <mui.TextField ref="search" onChange={this.findUser}
                       floatingLabelText="email"
                       hintText="joe@example.com"/>
        {expiry}
        <span> </span><mui.RaisedButton label="add" onClick={this.addUser} secondary={true} />
        <mui.List>
          {trustedMatches}
        </mui.List>
      </mui.Paper>
    );

    return content;
  }
});
