
nqmTBX.pages.ErrorPage = React.createClass({
  propTypes: {
    statusCode: React.PropTypes.number
  },
  render: function() {
    return (
      <div>ERROR - {this.props.statusCode}</div>
    );
  }
});