const {
  Card,
  CardHeader,
  CardTitle,
  CardActions,
  CardText,
  RaisedButton,
  RadioButton,
  RadioButtonGroup
  } = mui;

DatasetSummary = React.createClass({
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
    return (
      <Card ref={"card-" + this.props.dataset.id} key={this.props.dataset.id} className="" initiallyExpanded={false} style={styles.card} onClick={this.onClick.bind(this,this.props.dataset.id)} onExpandChange={this.onExpandChange}>
        <CardTitle
          titleStyle={styles.cardTitle}
          subtitleStyle={styles.cardSubtitle}
          title={this.props.dataset.name}
          subtitle={this.props.dataset.description}
          showExpandableButton={true}>
        </CardTitle>
        <CardText style={styles.cardText} expandable={true}>
          <p>dataset id: {this.props.dataset.id}</p>
          <p>metadata URL: <a style={styles.anchor} target="_blank" href={Meteor.settings.public.queryURL + "/" + this.props.dataset.id}>{Meteor.settings.public.queryURL + "/" + this.props.dataset.id}</a></p>
          <p>data URL: <a style={styles.anchor} target="_blank" href={this.props.dataset.dataUrl}>{this.props.dataset.dataUrl}</a></p>
        </CardText>
        <CardActions expandable={true}>
          <RaisedButton label="edit" primary={true} linkButton={true} href="/dataset/edit" />
          <RaisedButton label="share" secondary={true} linkButton={true} href={"/dataset/share/" + this.props.dataset.id} />
        </CardActions>
      </Card>
    );
  }
});