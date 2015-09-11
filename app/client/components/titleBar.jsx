nqmTBX.TitleBar = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    showBack: React.PropTypes.bool,
    onNavToggle: React.PropTypes.func,
    showSearch: React.PropTypes.bool,
    showUserMenu: React.PropTypes.bool,
    onSearch: React.PropTypes.func
  },
  getDefaultProps: function() {
    return {
      showBack: false,
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
  goBack: function() {
    window.history.go(-1);
  },
  render: function() {
    var muiTheme = ThemeManager.getCurrentTheme();
    var toolbarHeight = muiTheme.component.toolbar.height;
    var iconButtonSize = muiTheme.component.button.iconButtonSize;

    var styles = {
      title: {
      },
      nquiring: {
        fontWeight: "light",
        paddingRight: "0px",
        color: ThemeManager.getCurrentTheme().palette.canvasColor
      },
      toolbox: {
        fontWeight: "bolder",
        color: ThemeManager.getCurrentTheme().palette.canvasColor
      },
      iconButton: {
        marginTop: (toolbarHeight - iconButtonSize) / 2,
      },
      fontIcon: {
        color: ThemeManager.getCurrentTheme().palette.canvasColor
      },
      iconMenuButton: {
        verticalAlign: "middle",
      },
      toolbar: {
        fontFamily: ThemeManager.getCurrentTheme().contentFontFamily,
        color: ThemeManager.getCurrentTheme().palette.canvasColor,
        position: "fixed",
        zIndex: 10,
        boxShadow: "0px 2px 2px rgba(0,0,0,0.2)",
        paddingLeft: "4px"
      },
      currentUser: {
        color: ThemeManager.getCurrentTheme().palette.canvasColor,
      },
      rightToolGroup: {
        paddingTop: "16px"
      }
    };
    var leftGroup;
    var searchGroup;
    var userMenu;

    if (this.props.showBack) {
      leftGroup = (
        <mui.ToolbarGroup key={0} float="left">
          <mui.RaisedButton label="back" onClick={this.goBack}>
            <mui.FontIcon style={{float:"left", height: "100%", lineHeight: "36px", verticalAlign: "middle"}} className="material-icons">arrow_back</mui.FontIcon>
          </mui.RaisedButton>
        </mui.ToolbarGroup>
      );
    } else {
      leftGroup = (
        <div>
          <mui.ToolbarGroup key={0} float="left">
            <mui.IconButton style={styles.iconButton} iconStyle={styles.fontIcon} disabled={!(this.props.onNavToggle)} onClick={this.navToggled}><mui.FontIcon className="material-icons">menu</mui.FontIcon></mui.IconButton>
          </mui.ToolbarGroup>
          <mui.ToolbarGroup key={1} float="left" style={styles.title}>
            <mui.ToolbarTitle text="nquire" style={styles.nquiring} />
            <mui.ToolbarTitle text="Toolbox" style={styles.toolbox} />
          </mui.ToolbarGroup>
        </div>
      );
    }

    if (this.props.showSearch) {
      searchGroup = (
        <mui.ToolbarGroup key={2} float="left" style={styles.title}>
          <mui.FontIcon style={styles.fontIcon} className="material-icons">search</mui.FontIcon>
          <mui.TextField inputStyle={styles.fontIcon} underlineFocusStyle={{borderColor:mui.Styles.Colors.pink500}} hintText="search" onChange={this.searchTextChanged} />
        </mui.ToolbarGroup>
      );
    }

    if (this.props.showUserMenu) {
      userMenu = (
        <mui.ToolbarGroup style={styles.rightToolGroup} key={3} float="right" >
          <span style={styles.currentUser}>{this.data.currentUser + " "}</span>
          <mui.IconMenu style={styles.iconMenuButton} iconButtonElement={<mui.FontIcon style={styles.fontIcon} className="material-icons">account_box</mui.FontIcon>}>
            <mui.MenuItem primaryText="profile" />
            <mui.MenuItem primaryText="logout" onClick={this.logout} />
          </mui.IconMenu>
        </mui.ToolbarGroup>
      );
    }

    var content = (
      <mui.Toolbar style={styles.toolbar}>
        {leftGroup}
        {searchGroup}
        {userMenu}
      </mui.Toolbar>);

    return content;
  }
});