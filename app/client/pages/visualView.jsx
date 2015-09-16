
nqmTBX.pages.VisualView = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    resourceId: React.PropTypes.string.isRequired
  },
  getMeteorData: function() {
    return {};
  },
  _onAdd: function() {
    FlowRouter.go("visualAddWidget",{id: this.props.resourceId});
  },  
  _onSave: function() {
    this.refs.sheet.save();
  },
  render: function() {
    var styles = {
      toolbar: {
        paddingLeft: "4px",
        position: "fixed",
        backgroundColor: appPalette.primary3Color,
        zIndex: 1
      },
      resourcePanel: {
        overflowY: "auto",
        position: "absolute",
        top: 112,
        right: 0,
        bottom: 0,
        left: 0,
        padding: 10
      },
    };
    var toolbar = (
      <mui.Toolbar style={styles.toolbar}>
        <mui.ToolbarGroup>
          <mui.FontIcon color={appPalette.textColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this._onSave}>save</mui.FontIcon>
          <mui.FontIcon color={appPalette.textColor} hoverColor={appPalette.accent1Color} className="material-icons" onClick={this._onAdd} >add</mui.FontIcon>          
        </mui.ToolbarGroup>
      </mui.Toolbar>
    ) ;

    return (
      <div className="nqm-page-content">
        {toolbar}
        <div style={styles.resourcePanel}>
          <nqmTBX.Sheet ref="sheet" resourceId={this.props.resourceId} />
        </div>      
      </div>
    );
	}
});