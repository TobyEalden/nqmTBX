
MainLayout = React.createClass({
  mixins: [ ReactMeteorData ],
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getMeteorData: function() {
    var data = {
      loggingIn: Meteor.loggingIn(),
      loggedIn: ((Meteor.user() && Meteor.user().nqmId && accounts.findOne()) ? true : false)
    };

    return data;
  },
  getInitialState: function() {
    if (Session.get("nqm-sidebar-open") !== false) {
      Session.set("nqm-sidebar-open",true);      
    }
    return { sidebarOpen: true }
  },
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  toggleNav: function() {
    Session.set("nqm-sidebar-open",!this.state.sidebarOpen);
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  },
  getContent: function(styles) {
    var sideBar;
    if (this.state.sidebarOpen) {
      sideBar = <nqmTBX.SideBarMenu />;
    }

    return (
      <div style={{height:"100%"}}>
        <nqmTBX.TitleBar onNavToggle={this.toggleNav} showSearch={this.data.loggedIn} showUserMenu={this.data.loggedIn} />
        <div className="nqm-below-header">
          { sideBar }
          { this.props.content() }
        </div>
      </div>
    );
  },
  render: function() {
    var muiTheme = ThemeManager.getCurrentTheme();
    var toolbarHeight = muiTheme.component.toolbar.height;

    var styles = {
      body: {
        backgroundColor: mui.Styles.Colors.blueGrey700
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
      <div className="nqm-full-page" style={styles.body}>
        {content}
        <nqmTBX.Notification />
      </div>
    );
  }
});
