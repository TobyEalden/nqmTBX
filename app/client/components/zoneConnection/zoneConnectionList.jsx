
nqmTBX.ZoneConnectionList = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    trustedZones: React.PropTypes.array.isRequired,
    emailField: React.PropTypes.string.isRequired,
  },
  contextTypes: {
    onAccept: React.PropTypes.func,
    onRemove: React.PropTypes.func,
    onInfo: React.PropTypes.func
  },
  getMeteorData: function() {
    return {
      user: Meteor.user()
    }
  },
  getInitialState: function() {
    return {
      selection: []
    }
  },
  getSelection: function() {
    return this.state.selection;
  },
  clearSelection: function() {
    this.setState({selection:[]});
  },
  onSelection: function(selectedRows) {
    if (selectedRows.length > 0) {
      this.onInfoClick(this.props.trustedZones[selectedRows[0]]);      
    }
  },
  onInfoClick: function(conn,e) {
    if (e) {
      e.stopPropagation();
    }
    this.context.onInfo(conn);
  },
  onAcceptClick: function(conn,e) {
    e.stopPropagation();
    this.context.onAccept(conn);
  },
  onRemoveClick: function(conn,e) {
    e.stopPropagation();
    this.context.onRemove(conn);
  },
  componentWillReceiveProps: function() {
    this.clearSelection();
  },
  _getRowButtons: function(conn) {
    var buttons = [];
    if (conn.status !== "trusted" && conn.owner !== this.data.user.username) {
      buttons.push(<mui.IconButton key={0} iconClassName="material-icons" onClick={this.onAcceptClick.bind(this,conn)}>done</mui.IconButton>);
    }
    buttons.push(<mui.IconButton key={1} iconClassName="material-icons" onClick={this.onInfoClick.bind(this,conn)}>info_outline</mui.IconButton>);
    buttons.push(<mui.IconButton key={2} iconClassName="material-icons" onClick={this.onRemoveClick.bind(this,conn)}>clear</mui.IconButton>);
    return buttons;
  },
  render: function() {
    var styles = {
      usernameColumn: {
        width: "33%"
      },
      expiredRow: {
        backgroundColor: mui.Styles.Colors.redA100
      }
    };
    var trustedBig = this.props.trustedZones.map(function (conn) {
      var expiry = (nqmTBX.helpers.neverExpire.valueOf() === conn.expires.valueOf()) ? "never" : moment(conn.expires).format("YYYY-MM-DD");
      var buttons = this._getRowButtons(conn);
      var rowStyle = conn.status === "expired" ? styles.expiredRow : {};
      return (
        <mui.TableRow style={rowStyle} key={conn.id} onClick={this.onInfoClick.bind(this,conn)}>
          <mui.TableRowColumn style={styles.usernameColumn}>{conn[this.props.emailField]}</mui.TableRowColumn>
          <mui.TableRowColumn>{expiry}</mui.TableRowColumn>
          <mui.TableRowColumn>{conn.status}</mui.TableRowColumn>
          <mui.TableRowColumn>{buttons}</mui.TableRowColumn>
        </mui.TableRow>
      );
    }, this);

    var trustedSmall = this.props.trustedZones.map(function (conn) {
      var buttons = this._getRowButtons(conn);
      var rowStyle = conn.expires <= new Date() ? styles.expiredRow : {};
      return (
        <mui.TableRow style={rowStyle} key={conn.id} onClick={this.onInfoClick.bind(this,conn)}>
          <mui.TableRowColumn>{conn[this.props.emailField]}</mui.TableRowColumn>
          <mui.TableRowColumn>{buttons}</mui.TableRowColumn>
        </mui.TableRow>
      );
    }, this);

    // Need to do media query at top level unfortunately as tables seem very
    // sensitive to being mutated by the browser and then upsetting react.
    var content = (
      <div>
        <MediaQuery minWidth={900}>
          <mui.Table ref="table" selectable={true} fixedHeader={true} height="400px" onRowSelection={this.onSelection}>
            <mui.TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <mui.TableRow>
                <mui.TableHeaderColumn style={styles.usernameColumn}>e-mail</mui.TableHeaderColumn>
                <mui.TableHeaderColumn>expires</mui.TableHeaderColumn>
                <mui.TableHeaderColumn>status</mui.TableHeaderColumn>
                <mui.TableHeaderColumn>action</mui.TableHeaderColumn>
              </mui.TableRow>
            </mui.TableHeader>
            <mui.TableBody deselectOnClickaway={false} displayRowCheckbox={false}>{trustedBig}</mui.TableBody>
          </mui.Table>
        </MediaQuery>
        <MediaQuery maxWidth={900}>
          <mui.Table ref="table" selectable={true} fixedHeader={true} height="400px" onRowSelection={this.onSelection}>
            <mui.TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <mui.TableRow>
                <mui.TableHeaderColumn>e-mail</mui.TableHeaderColumn>
                <mui.TableHeaderColumn>action</mui.TableHeaderColumn>
              </mui.TableRow>
            </mui.TableHeader>
            <mui.TableBody deselectOnClickaway={false} displayRowCheckbox={false}>{trustedSmall}</mui.TableBody>
          </mui.Table>
        </MediaQuery>
      </div>
    );

    return content;
  }
});