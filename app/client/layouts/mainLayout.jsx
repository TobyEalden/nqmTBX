const {
  AppCanvas,
  AppBar,
  DropDownMenu,
  DropDownIcon,
  MenuItem,
  LeftNav,
  List,
  ListItem,
  ListDivider,
  FontIcon,
  Paper,
  TextField,
  Toolbar,
  ToolbarGroup,
  ToolbarTitle,
  ToolbarSeparator,
  IconMenu,
  IconButton,
  CircularProgress,
  RaisedButton,
  } = mui;

MainLayout = React.createClass({
  mixins: [ ReactMeteorData ],
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getMeteorData: function() {
    var data = {
      loggingIn: Meteor.loggingIn(),
      loggedIn: Meteor.user() && Meteor.user().nqmId
    };

    return data;
  },
  getInitialState: function() {
    return { sidebarOpen: true }
  },
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  toggleNav: function() {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  },
  logout: function() {
    nqmTBX.helpers.logout();
  },
  searchTextChanged: function(e) {
    Session.set("nqm-search",e.target.value);
  },
  getContent: function() {
    var muiTheme = ThemeManager.getCurrentTheme();
    var toolbarHeight = muiTheme.component.toolbar.height;
    var iconButtonSize = muiTheme.component.button.iconButtonSize;

    var styles = {
      page: {
        height: "100%",
        display: "flex",
        flexDirection: "row",
        //backgroundColor: appPalette.primary2Color,
        alignContent: "stretch"
      },
      title: {
        fontFamily: ThemeManager.getCurrentTheme().contentFontFamily,
        color: ThemeManager.getCurrentTheme().palette.textColor
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
      grid: {
        paddingTop: toolbarHeight,
        width: "100%"
      },
      toolbar: {
        position: "fixed",
        zIndex: 10,
        boxShadow: "0px 2px 2px rgba(0,0,0,0.2)"
      },
      sideBar: {
        width: "200px",
        flex: "none",
        position: "relative",
        transition: "all 2s linear"
      },
      contentCell: {
        position: "relative",
        overflowY: "auto",
        padding: "20px",
      },
      content: {
        display: "flex",
        flexDirection: "column",
        //backgroundColor: appPalette.primary2Color,
      }
    };

    var sideBar;
    if (this.state.sidebarOpen) {
      sideBar = <div className="Grid-cell" style={styles.sideBar}><SideBarMenu /></div>
    }

    return <div style={styles.page}>
      <Toolbar style={styles.toolbar}>
        <ToolbarGroup key={0} float="left">
          <IconButton style={styles.iconButton} onClick={this.toggleNav}><FontIcon className="material-icons">menu</FontIcon></IconButton>
        </ToolbarGroup>
        <ToolbarGroup key={1} float="left" style={styles.title}>
          <ToolbarTitle text="nquiring" style={styles.nquiring} />
          <ToolbarTitle text="Toolbox" style={styles.toolbox} />
        </ToolbarGroup>
        <ToolbarGroup key={2} float="left" style={styles.title}>
          <FontIcon className="material-icons">search</FontIcon>
          <TextField hintText="search" onChange={this.searchTextChanged} />
        </ToolbarGroup>
        <ToolbarGroup key={3} float="right" >
          <IconMenu style={styles.iconButton} iconButtonElement={<FontIcon className="material-icons">account_box</FontIcon>}>
            <MenuItem primaryText="logout" onClick={this.logout} />
            <MenuItem primaryText="about" />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
      <div className="Grid" style={styles.grid}>
        { sideBar }
        <div className="Grid-cell" style={styles.contentCell}>
          <div style={styles.content}>
            { this.props.content() }
          </div>
        </div>
      </div>
    </div>
  },
  render: function() {
    var content;
    if (this.data.loggingIn) {
      content = <CircularProgress mode="indeterminate" />;
    } else if (this.data.loggedIn) {
      content = this.getContent();
    } else {
      content = <Login />;
    }
    return <AppCanvas>{content}</AppCanvas>
  }
});
