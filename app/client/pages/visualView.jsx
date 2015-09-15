
nqmTBX.pages.VisualView = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    resourceId: React.PropTypes.string.isRequired
  },
  getMeteorData: function() {
    return {};
  },
  _onAddWidget: function() {
    FlowRouter.go("visualAddWidget",{id: this.props.resourceId});
  },
  _onSaveSheet: function() {

  },
  render: function() {
    var styles = {
      toolbar: {
        paddingLeft: "4px",
        position: "fixed",
        backgroundColor: appPalette.primary3Color,
        zIndex: 1
      },
      sheet: {
        marginTop: 60
      }
    };
    var toolbar = (
      <mui.Toolbar style={styles.toolbar}>
        <mui.ToolbarGroup>
          <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" >save</mui.FontIcon>
          <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this._onAddWidget} >add</mui.FontIcon>
          <mui.FontIcon color={appPalette.canvasColor} hoverColor={appPalette.accent1Color} className="material-icons" >view_module</mui.FontIcon>
        </mui.ToolbarGroup>
      </mui.Toolbar>
    ) ;

    return (
      <div>
        {toolbar}
        <div style={styles.sheet}>
          <nqmTBX.Sheet resourceId={this.props.resourceId} />
        </div>      
      </div>
    );
	}
});