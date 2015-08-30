const ThemeManager = new mui.Styles.ThemeManager();

UnauthLayout = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  render() {
    return <div>{this.props.content()}</div>
  }
});