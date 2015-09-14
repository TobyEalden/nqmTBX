
nqmTBX.pages.VisualView = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    resourceId: React.PropTypes.string.isRequired
  },
  getMeteorData: function() {
    return {

    };
  },
  render: function() {
    return (
      <nqmTBX.Sheet />
    );
	}
});