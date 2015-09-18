
nqmTBX.ResourceList = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    resources: React.PropTypes.array,
    type: React.PropTypes.string.isRequired,
    onEdit: React.PropTypes.func,
    onView: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    onDefault: React.PropTypes.func,
    getActiveContent: React.PropTypes.func
  },
  getMeteorData: function() {
    return {
      user: Meteor.user(),
    }
  },
  getInitialState: function() {
    return {
      activeResource: Session.get("nqm-active-resource"),
      hoveredResource: null
    }
  },
  _onEditClick: function(resource, e) {
    e.stopPropagation();
    if (this.props.onEdit) {
      this.props.onEdit(resource);
    }
  },
  _onViewClick: function(resource, e) {
    e.stopPropagation();
    if (this.props.onView) {
      this.props.onView(resource);
    }
  },
  _onDeleteClick: function(resource, e) {
    e.stopPropagation();
    if (this.props.onDelete) {
      this.props.onDelete(resource);
    }
  },
  _onShareClick: function(resource, e) {
    e.stopPropagation();
    FlowRouter.go("resourceShare", {id: resource.id, type: this.props.type });
  },
  _onNotImplmented: function(resource, e) {
    e.stopPropagation();
    nqmTBX.ui.notification("not implemented");
  },
  _onMoreClick: function(e) {
    e.stopPropagation();
  },
  _onRowSelection: function(resource) {
    if (resource.id === this.state.activeResource) {
      this.setState({ activeResource: null });
      Session.set("nqm-active-resource",null);
    } else {
      this.setState({ activeResource: resource.id });
      Session.set("nqm-active-resource",resource.id);
    }
  },
  _onRowHover: function(resource) {
    this.setState({ hoveredResource : resource.id });
  },
  _getRowButtons: function(styles, resource) {
    var buttons = [];
    if (this.state.hoveredResource === resource.id) {
      var iconMenu = (
        <mui.IconMenu openDirection="bottom-left" key={4} style={styles.buttonStyle} iconButtonElement={<mui.IconButton key={5} tooltip="more" style={styles.buttonStyle} iconStyle={styles.iconStyle} iconClassName="material-icons" onClick={this._onMoreClick}>more_vert</mui.IconButton>}>
          <mui.MenuItem key={0} primaryText="quick view" onClick={this._onViewClick.bind(this,resource)} />
          <mui.MenuItem key={1} primaryText="share..." onClick={this._onShareClick.bind(this,resource)} />
          <mui.MenuItem key={3} primaryText="move..." onClick={this._onNotImplmented.bind(this,resource)} />
          <mui.MenuItem key={4} primaryText="delete..." onClick={this._onDeleteClick.bind(this,resource)} />
          <mui.MenuDivider key={5} />
          <mui.MenuItem key={6} primaryText="export..."  onClick={this._onNotImplmented.bind(this,resource)} />
          <mui.MenuItem key={7} primaryText="derive..."  onClick={this._onNotImplmented.bind(this,resource)} />
        </mui.IconMenu>
      );
      buttons.push(iconMenu);
      buttons.push(<mui.IconButton key={2} tooltip="edit" style={styles.buttonStyle} iconStyle={styles.iconStyle} iconClassName="material-icons" onClick={this._onEditClick.bind(this,resource)}>edit</mui.IconButton>);
      buttons.push(<mui.IconButton key={1} tooltip="view" style={styles.buttonStyle} iconStyle={styles.iconStyle} iconClassName="material-icons" onClick={this._onViewClick.bind(this,resource)}>pageview</mui.IconButton>);
      // if (resource.owner === this.data.user.username) {
      //   buttons.push(<mui.IconButton key={0} tooltip="share" style={styles.buttonStyle} iconStyle={styles.iconStyle} iconClassName="material-icons" onClick={this._onShareClick.bind(this,resource)}>share</mui.IconButton>);
      // }
    }
    return buttons;
  },
  _getAvatar: function(styles,resource) {
    var avIcon;
    switch (resource.shareMode) {
      case "public":
        avIcon = "public";
        break;
      case "specific":
        if (resource.owner === this.data.user.username) {
          avIcon = "person_add";
        } else {
          avIcon = "person_outline";
        }
        break;
      default:
        avIcon = "lock_outline";
        break;
    }
    return <mui.FontIcon style={styles.avatar} className="material-icons">{avIcon}</mui.FontIcon>;
  },
  _onGoToResource: function(resource, e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.onDefault) {
      this.props.onDefault(resource, e);
    }
  },
  render: function() {
    var styles = this._getStyles();
    var content;
    if (this.props.resources && this.props.resources.length > 0) {
      var resourceList = [];
      _.each(this.props.resources, function(resource) {
        var row;
        var buttons = this._getRowButtons(styles, resource);
        var avatar = this._getAvatar(styles,resource);
        var keyDataRow = (
          <div key={resource.id} className="Grid" style={styles.row} key={resource.id} onMouseOver={this._onRowHover.bind(this,resource)} onClick={this._onRowSelection.bind(this,resource)}>
            <div className="Grid-cell" style={styles.nameColumn}>
              <div style={this.state.activeResource === resource.id ? styles.nameColumnInnerActive : styles.nameColumnInner}>
                {avatar} {resource.name} {/*<a style={styles.defaultButton} href="#" onClick={this._onGoToResource.bind(this,resource)}>{resource.name}</a>*/}
              </div>
            </div>
            <MediaQuery minWidth={900}>
              <div className="Grid-cell" style={styles.ownerColumn}>{resource.owner}</div>
            </MediaQuery>
            <div className="Grid-cell"  style={styles.actionColumn}>{buttons}</div>
          </div>
        );

        if (this.state.activeResource === resource.id) {
          var activeContent;
          if (this.props.getActiveContent) {
            activeContent = this.props.getActiveContent(resource);
          }
          row = (
            <div>
              {keyDataRow}
              <div key={resource.id+"-active"} className="Grid" style={styles.description} onMouseOver={this._onRowHover.bind(this,resource)} onClick={this._onRowSelection.bind(this,resource)}>
                <div className="Grid-cell">
                  {resource.description}
                  <div style={styles.shareSummary}>
                    <nqmTBX.SharedWithSummary resource={resource} onClick={this._onShareClick.bind(this,resource)} />
                  </div>
                  {activeContent}
                </div>
              </div>
            </div>
          );
        } else {
          row = keyDataRow;
        }
        resourceList.push(row);
      }, this);

      content = (
        <div>
        {/* this is the header row
          <div className="Grid" style={styles.headerRow}>
            <div className="Grid-cell" style={{paddingLeft:30}}>name</div>
            <MediaQuery minWidth={900}>
              <div className="Grid-cell" style={styles.ownerColumn}>owner</div>
            </MediaQuery>
            <div className="Grid-cell" style={styles.actionColumn}>actions</div>
          </div>
        */}
          <mui.Paper style={styles.resourceList}>
            {resourceList}
          </mui.Paper>
        </div>
      );
    } else if (this.props.resources) {
      content = <div style={styles.centredPanel}><h4>none found</h4></div>;
    } else {
      content = <div style={styles.centredPanel}><mui.CircularProgress mode="indeterminate" /></div>;
    }

    return content;
  },
  _getStyles: function() {
    return styles = {
      resourceList: {
        margin: 10,
      },
      centredPanel: {
        color: appPalette.textColor,
        margin: 50,
        textAlign: "center"
      },
      headerRow: {
        padding: "4px 10px 4px 10px"
      },
      row: {
        height: "50px",
        lineHeight: "50px",
        verticalAlign: "middle",
        borderWidth: 0,
        borderTopWidth: 1,
        borderColor: mui.Utils.ColorManipulator.darken(appPalette.nqmTBXListBackground, 0.05),
        borderStyle: "solid",
        padding: "0px 4px 0px 0px",
        color: appPalette.nqmTBXListTextColor,
        backgroundColor: appPalette.nqmTBXListBackground,
      },
      description: {
        padding: "0px 4px 8px 34px",
        color: appPalette.nqmTBXListTextColor,
        backgroundColor: appPalette.nqmTBXListBackground,
        borderWidth: 0,
        borderLeftColor: appPalette.accent1Color,
        borderLeftWidth: 2,
        borderStyle: "solid",
      },
      nameColumnInner: {
        borderWidth: 0,
        borderLeftColor: "transparent",
        borderLeftWidth: 2,
        borderStyle: "solid",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      nameColumnInnerActive: {
        borderWidth: 0,
        borderLeftColor: appPalette.accent1Color,
        borderLeftWidth: 2,
        borderStyle: "solid",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      nameColumn: {
        width: "50%!important",
        flex: "none!important",
      },
      actionColumn: {
        minWidth: 245,
        textAlign: "right"
      },
      avatar: {
        verticalAlign: "middle",
        color: appPalette.accent2Color,
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: "20px"
      },
      shareSummary: {
        paddingTop: 10
      },
      buttonStyle: {
        float: "right",
      },
      iconStyle: {
        color: appPalette.nqmTBXListIconColor
      },
      defaultButton: {
      }
    }
  }
});