
VisualisePage = React.createClass({
  componentDidMount: function() {
  },
  _onAddSheet: function() {
    FlowRouter.go("visualCreate");
  },
  render: function() {
    var styles = {
      toolbar: {
        paddingLeft: "4px",
        position: "fixed",
        backgroundColor: appPalette.primary3Color,
        zIndex: 1
      },
    };
    var toolbar = (
      <mui.Toolbar style={styles.toolbar}>
        <mui.ToolbarGroup>
          <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this._onAddSheet} >add</mui.FontIcon>
          <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" >view_module</mui.FontIcon>
        </mui.ToolbarGroup>
      </mui.Toolbar>
    );

    return (
      <div>
        {toolbar}        
      </div>
    );
  }
});

