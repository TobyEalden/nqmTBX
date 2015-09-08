const {
  List,
  ListItem,
  FontIcon
} = mui;

SideBarMenu = React.createClass({

  propTypes: {
    onToggle: React.PropTypes.func
  },

  render: function() {
    let styles = {
      root: {
        backgroundColor: appPalette.canvasColor,
        position: "absolute",
        width: "100%",
        height: "100%",
        overflowY: "auto"
      }
    };

    goVisualise = function() {
      FlowRouter.go("/visualise");
    };
    goDatasets = function() {
      FlowRouter.go("/datasets");
    };
    goTrustedUsers = function() {
      FlowRouter.go("/trusted");
    };
    goHelp = function() {
      FlowRouter.go("/help");
    };

    let sideBarMenu = <List style={ styles.root } >
      <ListItem primaryText="visualise" onClick={goVisualise} leftIcon={<FontIcon className="material-icons">dashboard</FontIcon>} />
      <ListItem primaryText="sensor data" leftIcon={<FontIcon className="material-icons">input</FontIcon>} />
      <ListItem primaryText="datasets" onClick={goDatasets} leftIcon={<FontIcon className="material-icons">data_usage</FontIcon>} />
      <ListItem primaryText="trusted users" onClick={goTrustedUsers} leftIcon={<FontIcon className="material-icons">supervisor_account</FontIcon>} />
      <ListItem primaryText="help" onClick={goHelp} leftIcon={<FontIcon className="material-icons">help_outline</FontIcon>} />
 </List>;

    return sideBarMenu;
  }
});