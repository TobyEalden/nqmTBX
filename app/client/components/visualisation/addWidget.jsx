const {
  IconMenu,
  MenuItem
} = mui;

nqmTBX.AddWidget = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    onAdd: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      selectedResource: "",
      resourceName: "",
      selectedWidgetType: "",
      widgetTypeName: "",
      selectedDatum: ""      
    }
  },
  getMeteorData: function() {
    var widgetTypeSub = Meteor.subscribe("widgetTypes");
    var resourceSub = Meteor.subscribe("datasets");

    return {
      ready: widgetTypeSub.ready() && resourceSub.ready(),
      widgetTypes: widgetTypes.find().fetch(),
      resources: datasets.find().fetch()
    };
  },
  _onWidgetTypeSelected: function(e,value) {
    var name = _.find(this.data.widgetTypes, function(w) { return w.name === value}).caption;
    this.setState({selectedWidgetType: value, widgetTypeName: name});
  },
  _onResourceSelected: function(e,value) {
    var name = _.find(this.data.resources, function(w) { return w.id === value}).name;
    this.setState({selectedResource: value, resourceName: name});
  },
  _onDatumSelected: function(e,value) {
    this.setState({selectedDatum: value});
  },
  _onCreate: function() {
    if (this.props.onAdd) {
      this.props.onAdd({
        widgetType: this.state.selectedWidgetType,
        resourceId: this.state.selectedResource,        
        datum: this.state.selectedDatum
      });
    }
  },
  render: function() {
    var resourceButton = <mui.IconButton iconClassName="material-icons">description</mui.IconButton>;
    var widgetTypeButton = <mui.IconButton iconClassName="material-icons">widgets</mui.IconButton>;
    var datumButton = <mui.IconButton iconClassName="material-icons">list</mui.IconButton>;

    if (!this.data.ready) {
      return <mui.CircularProgress mode="indeterminate" />;
    } else {
      var resourceList = _.map(this.data.resources, function(resource) {
        return <MenuItem value={resource.id} primaryText={resource.name} />;           
      });
      var widgetTypeList = _.map(this.data.widgetTypes, function(widgetType) {
        return <MenuItem value={widgetType.name} primaryText={widgetType.caption} />;
      });
      var datumSelector;
      if (this.state.selectedResource.length > 0) {
        var resource = datasets.findOne({id: this.state.selectedResource});
        var fieldList = _.map(resource.scheme, function(v,k) {
          return <MenuItem value={k} primaryText={k} />;
        });
        datumSelector = (
          <div>
            <mui.TextField floatingLabelText="datum" value={this.state.selectedDatum} />            
            <IconMenu onChange={this._onDatumSelected} iconButtonElement={datumButton} maxHeight={272} openDirection="bottom-right">{fieldList}</IconMenu>
          </div>
        );
      }
      return (
        <div>
          <div>
            <mui.TextField floatingLabelText="resource" value={this.state.resourceName} />            
            <IconMenu onChange={this._onResourceSelected}
              iconButtonElement={resourceButton}
              maxHeight={272}
              openDirection="bottom-right">
              {resourceList}
            </IconMenu>
          </div>
          <div>
            <mui.TextField floatingLabelText="visualisation" value={this.state.widgetTypeName} />            
            <IconMenu onChange={this._onWidgetTypeSelected}
              iconButtonElement={widgetTypeButton}
              maxHeight={272}
              openDirection="bottom-right">
              {widgetTypeList}
            </IconMenu>
          </div>
          {datumSelector}
          <div>
            <mui.RaisedButton label="create" primary={true} onClick={this._onCreate} />
          </div>
        </div>
      );
    }
  }
})