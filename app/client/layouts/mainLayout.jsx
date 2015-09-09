
MainLayout = React.createClass({
  mixins: [ ReactMeteorData ],
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getMeteorData: function() {
    var data = {
      loggingIn: Meteor.loggingIn(),
      loggedIn: (Meteor.user() && Meteor.user().nqmId ? true : false)
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
      sideBar = <div className="Grid-cell" style={styles.sideBar}><nqmTBX.SideBarMenu /></div>
    }

    return (
      <div style={styles.page}>
        <nqmTBX.TitleBar onNavToggle={this.toggleNav} showSearch={this.data.loggedIn} showUserMenu={this.data.loggedIn} />
        <div className="Grid" style={styles.grid}>
          { sideBar }
          <div className="Grid-cell" style={styles.contentCell}>
            <div style={styles.content}>
              { this.props.content() }
            </div>
          </div>
        </div>
      </div>
    );
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
      grid: {
        paddingTop: toolbarHeight,
        width: "100%"
      },
      sideBar: {
        width: "220px",
        flex: "none",
        position: "relative",
        transition: "all 2s linear",
        borderRight: "1px solid #eee"
      },
      contentCell: {
        position: "relative",
        overflowY: "auto",
        padding: 0,
      },
      content: {
        display: "flex",
        flexDirection: "column",
        //backgroundColor: appPalette.primary2Color,
      }
    };

    var content;
    if (this.data.loggingIn) {
      content = <mui.CircularProgress mode="indeterminate" />;
    } else if (this.data.loggedIn) {
      content = this.getContent(styles);
    } else {
      content = (
        <div>
          <nqmTBX.TitleBar showSearch={false} showUserMenu={this.data.loggedIn} />
          <nqmTBX.auth.Login allowCreate={true} />;
        </div>
      );
    }
    return (
      <mui.AppCanvas>
        {content}
        <nqmTBX.Notification />
      </mui.AppCanvas>
    );
  }
});
