
nqmTBX.SharedWithSummary = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    resource: React.PropTypes.object.isRequired,
    displayLimit: React.PropTypes.number
  },
  getDefaultPropTypes: function() {
    return { displayLimit: 2 }
  },
  getMeteorData: function() {
    var shareSub = Meteor.subscribe("shareTokens",this.props.resource.id);
    var data = {
      ready: shareSub.ready(),
      shares: shareTokens.find({ scope: this.props.resource.id, status: "trusted", expires: { $gt: new Date() }, owner: Meteor.user().username }).fetch()
    };
    return data;
  },
  onClick: function(e) {
    e.preventDefault();
    nqmTBX.ui.notification("clicked!",10000);
  },
  render: function() {
    var styles = {
      root: {
        paddingTop: "5px",
        pointer: "hand"
      },
      anchor: {
      }
    };
    var content;
    if (this.data.ready) {
      if (this.data.shares.length > 0) {
        shares = "Shared with ";
        shares += this.data.shares[0].userId;
        if (this.data.shares.length > 1) {
          shares += ", " + this.data.shares[1].userId;
          if (this.data.shares.length > 2) {
            shares += " and " + (this.data.shares.length-2) + " other" + ((this.data.shares.length-2) > 1 ? "s." : ".");
          }
        }
        content = <a style={styles.anchor} href="#" onClick={this.onClick}>{shares}</a>;
      } else {
        content = <span>Shared with no one.</span>;
      }
    } else {
      content = <span>loading</span>;
    }
    return <div style={styles.root} onClick={this.onClick}>{content}</div>;
  }
});

nqmTBX.SharedWith = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    resource: React.PropTypes.object.isRequired
  },
  getMeteorData: function() {
    var shareSub = Meteor.subscribe("shareTokens",this.props.resource.id);
    var data = {
      ready: shareSub.ready(),
      shares: shareTokens.find({ scope: this.props.resource.id, status: "trusted", expires: { $gt: new Date() }, owner: Meteor.user().username }).fetch()
    };
    return data;
  },
  deleteShare: function(id) {
    var cb = function(err, result) {
      if (result.error) {
        err = new Error(result.error);
      }
      if (err) {
        nqmTBX.ui.notification("delete share failed: " + err.message);
      }
      if (result && result.ok) {
        nqmTBX.ui.notification("command sent, " + result.result.id);
      }
    };
    Meteor.call("/app/share/delete", id, cb);
  },
  render: function() {
    var shares;
    if (this.data.ready) {
      shares = this.data.shares.map(function(sh) {
        return <div style={{width:"300px"}} key={sh.id}>
          {sh.userId} <mui.IconButton style={{verticalAlign: "middle"}} float="right" onClick={this.deleteShare.bind(this,sh.id)} iconClassName="material-icons">delete</mui.IconButton>
        </div>
      }, this);
      if (shares.length === 0) {
        shares = <div>no one</div>;
      }
    } else {
      shares = <mui.CircularProgress mode="indeterminate" />;
    }

    return <div>{shares}</div>;
  }
})