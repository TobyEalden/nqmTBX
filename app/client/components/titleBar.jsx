nqmTBX.TitleBar = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    onNavToggle: React.PropTypes.func,
    showSearch: React.PropTypes.bool,
    showUserMenu: React.PropTypes.bool,
    onSearch: React.PropTypes.func
  },
  getDefaultProps: function() {
    return {
      showSearch: true,
      showUserMenu: true
    }
  },
  getMeteorData: function() {
    return {
      currentUser: Meteor.user() ? Meteor.user().username : ""
    }
  },
  navToggled: function(e) {
    var toggle = Session.get("nqm-nav-toggle");
    Session.set("nqm-nav-toggle", !toggle);
    if (this.props.onNavToggle) {
      this.props.onNavToggle(toggle);
    }
  },
  searchTextChanged: function(e) {
    Session.set("nqm-search",e.target.value);
    if (this.props.onSearch) {
      this.props.onSearch(e.target.value);
    }
  },
  logout: function() {
    nqmTBX.helpers.logout();
  },
  render: function() {
    var muiTheme = ThemeManager.getCurrentTheme();
    var toolbarHeight = muiTheme.component.toolbar.height;
    var iconButtonSize = muiTheme.component.button.iconButtonSize;

    var styles = {
      title: {
      },
      nquiring: {
        fontWeight: "lighter",
        paddingRight: "0px",
        color: ThemeManager.getCurrentTheme().palette.textColor
      },
      toolbox: {
        fontWeight: "bolder",
        color: ThemeManager.getCurrentTheme().palette.textColor
      },
      iconButton: {
        marginTop: (toolbarHeight - iconButtonSize) / 2,
      },
      iconMenuButton: {
        verticalAlign: "middle",
      },
      toolbar: {
        fontFamily: ThemeManager.getCurrentTheme().contentFontFamily,
        color: ThemeManager.getCurrentTheme().palette.textColor,
        position: "fixed",
        zIndex: 10,
        boxShadow: "0px 2px 2px rgba(0,0,0,0.2)"
      },
      rightToolGroup: {
        paddingTop: "16px"
      }
    };
    var searchGroup;
    var userMenu;

    if (this.props.showSearch) {
      searchGroup = (
        <mui.ToolbarGroup key={2} float="left" style={styles.title}>
          <mui.FontIcon className="material-icons">search</mui.FontIcon>
          <mui.TextField hintText="search" onChange={this.searchTextChanged} />
        </mui.ToolbarGroup>
      );
    }

    if (this.props.showUserMenu) {
      userMenu = (
        <mui.ToolbarGroup style={styles.rightToolGroup} key={3} float="right" >
          <span>{this.data.currentUser + " "}</span>
          <mui.IconMenu style={styles.iconMenuButton} iconButtonElement={<mui.FontIcon className="material-icons">account_box</mui.FontIcon>}>
            <mui.MenuItem primaryText="logout" onClick={this.logout} />
            <mui.MenuItem primaryText="about" />
          </mui.IconMenu>
        </mui.ToolbarGroup>
      );
    }

    var content = (
      <mui.Toolbar style={styles.toolbar}>
        <mui.ToolbarGroup key={0} float="left">
          <mui.IconButton style={styles.iconButton} disabled={!(this.props.onNavToggle)} onClick={this.navToggled}><mui.FontIcon className="material-icons">menu</mui.FontIcon></mui.IconButton>
        </mui.ToolbarGroup>
        <mui.ToolbarGroup key={1} float="left" style={styles.title}>
          <mui.ToolbarTitle text="nquiring" style={styles.nquiring} />
          <mui.ToolbarTitle text="Toolbox" style={styles.toolbox} />
        </mui.ToolbarGroup>
        {searchGroup}
        {userMenu}
      </mui.Toolbar>);

    return content;
  }
});