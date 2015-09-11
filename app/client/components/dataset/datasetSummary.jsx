const {
  Card,
  CardHeader,
  CardTitle,
  CardActions,
  CardText,
  RaisedButton,
  FontIcon,
  RadioButton,
  RadioButtonGroup
  } = mui;

nqmTBX.DatasetSummary = React.createClass({
  propTypes: {
    dataset: React.PropTypes.object,
    onSummaryExpanded: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      expanded: false
    }
  },
  expand: function(value) {
    var card = this.refs["card-" + this.props.dataset.id];
    if (card) {
      card.setState({expanded: value});
      this.onExpandChange(value);
    }
  },
  onClick: function(ref, e) {
    if (!e.target.href) {
      var card = this.refs["card-" + this.props.dataset.id];
      this.expand(!card.state.expanded);
      e.preventDefault();
    }
  },
  onExpandChange: function(value) {
    if (value && this.props.onSummaryExpanded) {
      this.props.onSummaryExpanded(this);
    }
  },
  stopPropagation: function(e) {
    e.stopPropagation();
  },
  edit: function() {
    FlowRouter.go("datasetEdit"); //, {id: this.props.dataset.id });
  },
  share: function(e) {
    FlowRouter.go("datasetShare",{id: this.props.dataset.id});
  },
  render: function() {
    var styles = {
      card: {
        marginBottom: "4px",
        backgroundColor: "white",
        borderBottom: "1px solid #ddd"
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
      },
      buttonIcon: {
        verticalAlign: "middle",
        paddingRight: "4px",
        color: ThemeManager.getCurrentTheme().palette.canvasColor
      }
    };
    return (
      <Card ref={"card-" + this.props.dataset.id} key={this.props.dataset.id} className="" initiallyExpanded={false} style={styles.card} onClick={this.onClick.bind(this,this.props.dataset.id)} onExpandChange={this.onExpandChange} zDepth={0}>
        <CardTitle
          titleStyle={styles.cardTitle}
          subtitleStyle={styles.cardSubtitle}
          title={this.props.dataset.name}
          subtitle={this.props.dataset.description}
          showExpandableButton={true}>
        </CardTitle>
        <CardText style={styles.cardText} expandable={true}>
          <p>REST endpoint: <a style={styles.anchor} target="_blank" href={Meteor.settings.public.queryURL + "/datasets/" + this.props.dataset.id}>{Meteor.settings.public.queryURL + "/datasets/" + this.props.dataset.id}</a></p>
        </CardText>
        <CardActions expandable={true}>
          <RaisedButton label="view" secondary={true} linkButton={true} href={"/dataset/view/" + this.props.dataset.id}><FontIcon style={styles.buttonIcon} className="material-icons">visibility</FontIcon></RaisedButton>
          <RaisedButton label="share" secondary={true} linkButton={true} href={"/dataset/share/" + this.props.dataset.id}><FontIcon style={styles.buttonIcon} className="material-icons">share</FontIcon></RaisedButton>
          <RaisedButton label="edit" primary={true} linkButton={true} href={"/dataset/edit/" + this.props.dataset.id}><FontIcon style={styles.buttonIcon} className="material-icons">edit</FontIcon></RaisedButton>
        </CardActions>
      </Card>
    );
  }
});