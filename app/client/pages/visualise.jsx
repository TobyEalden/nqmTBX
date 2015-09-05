
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
        <mui.FloatingActionButton style={styles.actionButton} onClick={this.addVis} tooltip="new dataset"><mui.FontIcon className="material-icons">add</mui.FontIcon></mui.FloatingActionButton>
      </div>
    );
  }
});

