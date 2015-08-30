const ThemeManager = new mui.Styles.ThemeManager();

AppTitle = React.createClass({
  propTypes: {
    hideToggle: React.PropTypes.bool,
    onToggle: React.PropTypes.func
  },
  click: function() {
    this.props.onToggle();
  },
  render: function() {
    var styles = {
      root: {
        fontFamily: ThemeManager.getCurrentTheme().contentFontFamily,
        lineHeight: "56px",
        fontSize: "24px",
        color: ThemeManager.getCurrentTheme().palette.textColor
      },
      nquiring: {
        fontWeight: "lighter"
      },
      toolbox: {
        fontWeight: "bolder"
      },
      iconButton: {
        lineHeight: "44px",
        verticalAlign: "middle"
      }
    };
    var iconButton;
    if (!this.props.hideToggle) {
      iconButton = <mui.IconButton style={styles.iconButton} onClick={this.click}><mui.FontIcon className="material-icons">menu</mui.FontIcon></mui.IconButton>
    }
    return (
      <div style={styles.root}>
        {iconButton}<span style={styles.nquiring}>nquiring</span><span style={styles.toolbox}>Toolbox</span>
      </div>
    );
  }
});