
VisualisePage = React.createClass({
  componentDidMount: function() {
  },
  addVis: function() {

  },
  render: function() {
    var styles = {
      actionButton: {
        position: "fixed",
        bottom: "15px",
        right: "15px"
      }
    };
    return (
      <div>
        <nqmTBX.vis.Sheet />
      </div>
    );
  }
});

