
nqmTBX.pages.ResourceShare = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    resourceId: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
  },
  getInitialState: function() {
    return {
      sharingTrusted: false,
      initialDataRender: false,
      publication: this.props.type.toLowerCase() + "s",
      collection: this.props.type,
      commands: this.props.type.toLowerCase()
    }
  },
  getMeteorData: function() {
    var resourceSub = Meteor.subscribe(this.state.publication, { id: this.props.resourceId });
    var coll = Mongo.Collection.get(this.state.collection);
    return {
      ready: resourceSub.ready(),
      currentUser: Meteor.user(),
      resource: coll.findOne({ id: this.props.resourceId })
    }
  },
  save: function(mode) {
    Meteor.call("/app/" + this.state.commands + "/setShareMode", this.props.resourceId, mode, nqmTBX.helpers.methodCallback("setShareMode"));
  },
  sharingPrivate: function(e) {
    e.stopPropagation();
    this.setState({"sharingTrusted":false});
    this.save("private");
  },
  sharingPublic: function(e) {
    e.stopPropagation();
    this.setState({"sharingTrusted":false});
    this.save("public");
  },
  sharingTrusted: function(e) {
    e.stopPropagation();
    this.setState({"sharingTrusted":true});
    this.save("specific");
  },
  render: function() {
    var styles = {
      root: {
        padding: "10px",
      },
      anchor: {
        color: ThemeManager.getCurrentTheme().palette.textColor
      },
      radioButtonGroup: {
        paddingTop: "10px"
      }
    };
    if (this.data.ready) {
      var self = this;
      // HACK - fix this using a wrapper component.
      setTimeout(function() {
        if (!self.state.initialDataRender) {
          self.setState({sharingTrusted: self.data.resource.shareMode === "specific"});
          self.setState({initialDataRender: true});
        }
      },250);
      var trustedZones, trustedZonesSummary;
      if (this.state.sharingTrusted) {
        trustedZones = <nqmTBX.AddShare resource={this.data.resource} showExpiry={false} />;
//        trustedZonesSummary = <nqmTBX.SharedWithSummary resource={this.data.resource} />;
        trustedZonesSummary = <nqmTBX.SharedWith resource={this.data.resource} />;
      }

      return (
        <div>
          <mui.Paper zDepth={1} style={styles.root}>
            <h4>{"Sharing options for '" + this.data.resource.name + "'"}</h4>
            <mui.RadioButtonGroup style={styles.radioButtonGroup} ref="shareMode" name="shareType" defaultSelected={this.data.resource.shareMode}>
              <mui.RadioButton onClick={this.sharingPrivate}
                           value="private"
                           label="private - only you can access"/>
              <mui.RadioButton onClick={this.sharingPublic}
                           value="public"
                           label="public - anyone with the link can access"/>
              <mui.RadioButton onClick={this.sharingTrusted}
                           value="specific"
                           label="trusted - only people you trust can access"/>
            </mui.RadioButtonGroup>
            {trustedZonesSummary}
          </mui.Paper>
          {trustedZones}
        </div>
      )
    } else {
      return <mui.CircularProgress mode="indeterminate" />;
    }
  }
});