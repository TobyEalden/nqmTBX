
nqmTBX.TrustedUserList = React.createClass({
  propTypes: {
    trustedUsers: React.PropTypes.array.isRequired,
    emailField: React.PropTypes.string.isRequired
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
    this.state.selection = selectedRows;
  },
  onActionClick: function(e) {
    e.preventDefault();
    e.stopPropagation();
  },
  render: function() {
    var styles = {
      usernameColumn: {
        width: "33%"
      }
    };
    var trustedBig = this.props.trustedUsers.map(function (sh) {
      var expiry = (nqmTBX.helpers.neverExpire.valueOf() === sh.expires.valueOf()) ? "never" : moment(sh.expires).format("YYYY-MM-DD");
      return (
        <mui.TableRow key={sh.id}>
          <mui.TableRowColumn style={styles.usernameColumn}>{sh[this.props.emailField]}</mui.TableRowColumn>
          <mui.TableRowColumn>{expiry}</mui.TableRowColumn>
          <mui.TableRowColumn>{sh.status}</mui.TableRowColumn>
          <mui.TableRowColumn>
            <mui.IconButton iconClassName="material-icons" onClick={this.onActionClick}>done</mui.IconButton>
            <mui.IconButton iconClassName="material-icons" onClick={this.onActionClick}>clear</mui.IconButton>
          </mui.TableRowColumn>
        </mui.TableRow>
      );
    }, this);

    var trustedSmall = this.props.trustedUsers.map(function (sh) {
      return (
        <mui.TableRow key={sh.id}>
          <mui.TableRowColumn style={styles.usernameColumn}>{sh[this.props.emailField]}</mui.TableRowColumn>
        </mui.TableRow>
      );
    }, this);

    // Need to do media query at top level unfortunately as tables seem very
    // sensitive to being mutated by the browser and then upsetting react.
    var content = (
      <div>
        <MediaQuery minWidth={900}>
          <mui.Table ref="table" selectable={true} fixedHeader={true} height="400px" onRowSelection={this.onSelection}>
            <mui.TableHeader displaySelectAll={false}>
              <mui.TableRow>
                <mui.TableHeaderColumn style={styles.usernameColumn}>e-mail</mui.TableHeaderColumn>
                <mui.TableHeaderColumn>expires</mui.TableHeaderColumn>
                <mui.TableHeaderColumn>status</mui.TableHeaderColumn>
                <mui.TableHeaderColumn>action</mui.TableHeaderColumn>
              </mui.TableRow>
            </mui.TableHeader>
            <mui.TableBody deselectOnClickaway={false}>{trustedBig}</mui.TableBody>
          </mui.Table>
        </MediaQuery>
        <MediaQuery maxWidth={900}>
          <mui.Table ref="table" selectable={true} fixedHeader={true} height="400px" onRowSelection={this.onSelection}>
            <mui.TableHeader displaySelectAll={false}>
              <mui.TableRow>
                <mui.TableHeaderColumn style={styles.usernameColumn}>e-mail</mui.TableHeaderColumn>
              </mui.TableRow>
            </mui.TableHeader>
            <mui.TableBody deselectOnClickaway={false}>{trustedSmall}</mui.TableBody>
          </mui.Table>
        </MediaQuery>
      </div>
    );

    return content;
  }
});