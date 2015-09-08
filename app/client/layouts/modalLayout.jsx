
ModalLayout = React.createClass({
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
    return { }
  },
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  logout: function() {
    nqmTBX.helpers.logout();
  },
  getContent: function() {
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

    return <div style={styles.page}>
      <nqmTBX.TitleBar showBack={true} showSearch={false} showUserMenu={this.data.loggedIn} />
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
      content = <mui.CircularProgress mode="indeterminate" />;
    } else if (this.data.loggedIn) {
      content = this.getContent();
    } else {
      content = <nqmTBX.auth.Login />;
    }
    return (
      <mui.AppCanvas>
        {content}
        <nqmTBX.Notification />
      </mui.AppCanvas>
    );
  }
});
