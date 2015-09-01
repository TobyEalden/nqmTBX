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
  FlatButton,
  } = mui;

ModalLayout = React.createClass({
  mixins: [ ReactMeteorData ],
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getMeteorData: function() {
    var data = {
      loggingIn: Meteor.loggingIn(),
      loggedIn: Meteor.user()
    };

    return data;
  },
  getInitialState: function() {
    return { }
  },
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  logout: function() {
    docCookies.removeItem("nqmT","/");
    Meteor.logout();
    FlowRouter.go("/");
  },
  goBack: function() {
    window.history.go(-1);
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
          <FlatButton label="back" onClick={this.goBack}>
            <FontIcon style={{float:"left", height: "100%", lineHeight: "36px", verticalAlign: "middle"}} className="material-icons">arrow_back</FontIcon>
          </FlatButton>
        </ToolbarGroup>
        <ToolbarGroup key={3} float="right" >
          <IconMenu style={styles.iconButton} iconButtonElement={<FontIcon className="material-icons">account_box</FontIcon>}>
            <MenuItem primaryText="logout" onClick={this.logout} />
            <MenuItem primaryText="about" />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
      <div className="Grid" style={styles.grid}>
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
