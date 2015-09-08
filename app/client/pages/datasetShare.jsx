
nqmTBX.pages.DatasetSharePage = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    datasetId: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      sharingTrusted: false,
      initialDataRender: false
    }
  },
  getMeteorData: function() {
    var dsSub = Meteor.subscribe("datasets");
    return {
      ready: dsSub.ready(),
      currentUser: Meteor.user(),
      dataset: datasets.findOne({ id: this.props.datasetId })
    }
  },
  save: function(mode) {
    Meteor.call("/app/dataset/setShareMode", this.props.datasetId, mode, nqmTBX.helpers.methodCallback("setShareMode"));
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
          self.setState({sharingTrusted: self.data.dataset.shareMode === "specific"});
          self.setState({initialDataRender: true});
        }
      },250);
      var trustedUsers, summary;
      if (this.state.sharingTrusted) {
        trustedUsers = <nqmTBX.AddShare resource={this.data.dataset} showExpiry={false} />;
        summary = <nqmTBX.SharedWithSummary resource={this.data.dataset} />;
      }

      return (
        <div>
          <mui.Paper zDepth={1} style={styles.root}>
            <h4>{"Sharing options for '" + this.data.dataset.name + "'"}</h4>
            <mui.RadioButtonGroup style={styles.radioButtonGroup} ref="shareMode" name="shareType" defaultSelected={this.data.dataset.shareMode}>
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
            {summary}
          </mui.Paper>
          {trustedUsers}
        </div>
      )
    } else {
      return <mui.CircularProgress mode="indeterminate" />;
    }
  }
});