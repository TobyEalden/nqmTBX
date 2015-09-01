const {
  CircularProgress,
  Card,
  CardHeader,
  CardTitle,
  CardActions,
  CardText,
  FlatButton,
  RaisedButton,
  RadioButton,
  RadioButtonGroup,
  TextField,
  List,
  ListItem,
  FontIcon,
  IconButton
  } = mui;

DatasetSharePage = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    datasetId: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      sharingTrusted: false,
      trustedMatch: [],
      initialDataRender: false
    }
  },

  getMeteorData: function() {
    var dsSub = Meteor.subscribe("datasets");
    var shareSub = Meteor.subscribe("shareTokens",this.props.datasetId);
    var trustedSub = Meteor.subscribe("trustedUsers");

    return {
      ready: dsSub.ready() && shareSub.ready() && trustedSub.ready(),
      currentUser: Meteor.user(),
      dataset: datasets.findOne({ id: this.props.datasetId }),
      shares: shareTokens.find({ scope: this.props.datasetId, owner: Meteor.user().nqmId }).fetch(),
      trustedUsers: trustedUsers.find().fetch()
    }
  },
  save: function() {
    var cb = function(err, result) {
      if (result.error) {
        err = new Error(result.error);
      }
      if (err) {
        nqmTBX.ui.notification("setShareMode failed: " + err.message);
      }
      if (result && result.ok) {
        nqmTBX.ui.notification("command sent, " + result.result.id);
      }
    };
    var mode =  this.refs["shareMode"].getSelectedValue();
    Meteor.call("/app/dataset/setShareMode", this.props.datasetId, mode, cb);
  },
  sharingPrivate: function(e) {
    e.stopPropagation();
    this.setState({"sharingTrusted":false});
  },
  sharingPublic: function(e) {
    e.stopPropagation();
    this.setState({"sharingTrusted":false});
  },
  sharingTrusted: function(e) {
    e.stopPropagation();
    this.setState({"sharingTrusted":true});
  },
  findUser: function(e) {
    var lookup = e.target.value;
    if (lookup.length > 0) {
      var searchTerm = new RegExp(lookup,"gi");
      this.setState({ trustedMatch: trustedUsers.find({ userId: searchTerm}).fetch()});
    } else {
      this.setState({ trustedMatch: []});
    }
  },
  onMatchSelected: function(e) {
    this.refs["search"].setValue(e.target.innerText);
    this.setState({trustedMatch:[]});
  },
  addUser: function() {
    var cb = function(err, result) {
      if (result.error) {
        err = new Error(result.error);
      }
      if (err) {
        nqmTBX.ui.notification("share failed: " + err.message);
      }
      if (result && result.ok) {
        nqmTBX.ui.notification("command sent, " + result.result.id);
      }
    };
    var params = {
      userId: this.refs["search"].getValue(),
      scope: this.props.datasetId,
      resources: [
        { resource: "dataset", actions: ["read"] }
      ],
      issued: Date.now(),
      expires: Date.now() + 24*60*60*1000
    };
    Meteor.call("/app/share/create", params, cb);
    this.refs["search"].setValue("");
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
    var styles = {
      card: {
        marginBottom: "4px",
        backgroundColor: "white"
      },
      cardTitle: {
        fontSize: 14
      },
      cardSubtitle: {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
      },
      cardText: {
        color: ThemeManager.getCurrentTheme().palette.textColor,
        fontWeight: "normal"
      },
      anchor: {
        color: ThemeManager.getCurrentTheme().palette.textColor
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
      var trustedUsers;
      if (this.state.sharingTrusted) {
        var trustedMatches = this.state.trustedMatch.map(function(tm) {
          return <ListItem key={tm.id} primaryText={tm.userId} onClick={this.onMatchSelected} />
        },this);

        var trusts = this.data.shares.map(function(sh) {
          return <div style={{width:"300px"}} key={sh.id}>
            {sh.userId} <IconButton style={{verticalAlign: "middle"}} float="right" onClick={this.deleteShare.bind(this,sh.id)} iconClassName="material-icons">delete</IconButton>
            </div>
        }, this);
        if (trusts.length === 0) {
          trusts = <div>no one</div>;
        }
        trustedUsers = (
          <div>
            <CardTitle style={{paddingBottom: 0}} titleStyle={styles.cardTitle} subtitleStyle={styles.cardSubtitle} title="Currently shared with" />
            <CardText style={{paddingTop: 0, paddingBottom: 0}} >
              {trusts}
              <form>
                <TextField ref="search" onChange={this.findUser} floatingLabelText="add trusted user" /> <FlatButton label="add" onClick={this.addUser} />
                <List>
                  {trustedMatches}
                </List>
              </form>
            </CardText>
          </div>
        );
      }
      return (
        <Card ref={"card-" + this.props.datasetId} key={this.props.datasetId} className="" initiallyExpanded={true} style={styles.card}>
          <CardTitle style={{paddingBottom: "0px"}} titleStyle={styles.cardTitle} title={"Sharing options for '" + this.data.dataset.name + "'"} expandable={false} />
          <CardText style={{paddingTop: 0, paddingBottom: 0}} expandable={false}>
            <RadioButtonGroup ref="shareMode" name="shareType" defaultSelected={this.data.dataset.shareMode}>
              <RadioButton onClick={this.sharingPrivate}
                           value="private"
                           label="private - only you can access"/>
              <RadioButton onClick={this.sharingPublic}
                           value="public"
                           label="public - anyone with the link can access"/>
              <RadioButton onClick={this.sharingTrusted}
                           value="specific"
                           label="trusted - only people you trust can access"/>
            </RadioButtonGroup>
          </CardText>
          {trustedUsers}
          <CardActions>
            <RaisedButton label="save" primary={true} onClick={this.save} />
          </CardActions>
        </Card>
      )
    } else {
      return <CircularProgress mode="indeterminate" />;
    }
  }
});