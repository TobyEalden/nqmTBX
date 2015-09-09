
nqmTBX.TrustedUserList = React.createClass({
  propTypes: {
    trustedUsers: React.PropTypes.array.isRequired,
    statusField: React.PropTypes.string.isRequired
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
  render: function() {
    var styles = {
    };
    var trustedBig = this.props.trustedUsers.map(function (sh) {
      var expiry = (nqmTBX.helpers.neverExpire.valueOf() == sh.expires.valueOf()) ? "never" : moment(sh.expires).format("YYYY-MM-DD");
      return (
        <mui.TableRow key={sh.id}>
          <mui.TableRowColumn>{sh.userId}</mui.TableRowColumn>
          <mui.TableRowColumn>{expiry}</mui.TableRowColumn>
          <mui.TableRowColumn>{sh[this.props.statusField]}</mui.TableRowColumn>
        </mui.TableRow>
      );
    }, this);

    var trustedSmall = this.props.trustedUsers.map(function (sh) {
      return (
        <mui.TableRow key={sh.id}>
          <mui.TableRowColumn>{sh.userId}</mui.TableRowColumn>
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
                <mui.TableHeaderColumn tooltip="e-mail address">e-mail</mui.TableHeaderColumn>
                <mui.TableHeaderColumn tooltip="expired">expires</mui.TableHeaderColumn>
                <mui.TableHeaderColumn tooltip="status">status</mui.TableHeaderColumn>
              </mui.TableRow>
            </mui.TableHeader>
            <mui.TableBody deselectOnClickaway={false}>{trustedBig}</mui.TableBody>
          </mui.Table>
        </MediaQuery>
        <MediaQuery maxWidth={900}>
          <mui.Table ref="table" selectable={true} fixedHeader={true} height="400px" onRowSelection={this.onSelection}>
            <mui.TableHeader displaySelectAll={false}>
              <mui.TableRow>
                <mui.TableHeaderColumn tooltip="e-mail address">e-mail</mui.TableHeaderColumn>
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