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
  getContent: function(styles) {
    var sideBar;
    if (this.state.sidebarOpen) {
      sideBar = <div className="Grid-cell" style={styles.sideBar}><SideBarMenu /></div>
    }

    return <div style={styles.page}>
      <nqmTBX.TitleBar onNavToggle={this.toggleNav} showSearch={true} showUserMenu={true} />
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
    var muiTheme = ThemeManager.getCurrentTheme();
    var toolbarHeight = muiTheme.component.toolbar.height;

    var styles = {
      page: {
        height: "100%",
        display: "flex",
        flexDirection: "row",
        //backgroundColor: appPalette.primary2Color,
        alignContent: "stretch"
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
      grid: {
        paddingTop: toolbarHeight,
        width: "100%"
      },
      sideBar: {
        width: "200px",
        flex: "none",
        position: "relative",
        transition: "all 2s linear",
        borderRight: "1px solid #eee"
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

    var content;
    if (this.data.loggingIn) {
      content = <CircularProgress mode="indeterminate" />;
    } else if (this.data.loggedIn) {
      content = this.getContent(styles);
    } else {
      content = <nqmTBX.auth.LoginPage />;
    }
    return (
      <AppCanvas>
        {content}
        <nqmTBX.Notification />
      </AppCanvas>
    );
  }
});
