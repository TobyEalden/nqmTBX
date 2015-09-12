
nqmTBX.SideBarMenu = React.createClass({
  propTypes: {
    onToggle: React.PropTypes.func
  },
  render: function() {
    let styles = {
      root: {
        backgroundColor: appPalette.canvasColor,
        position: "absolute",
        width: "100%",
        height: "100%",
        overflowY: "auto"
      },
      listItem: {
        fontSize: "14px"
      },
      listItemInner: {
        paddingLeft: 48
      }
    };

    goVisualise = function() {
      FlowRouter.go("/visualise");
    };
    goDatasets = function() {
      FlowRouter.go("/datasets");
    };
    goConnections = function() {
      FlowRouter.go("/connections");
    };
    goHelp = function() {
      FlowRouter.go("/help");
    };
    goIOT = function() {

    };
    goProcesses = function() {

    };

    let sideBarMenu = <mui.List style={ styles.root } >
      <mui.ListItem key={0} style={styles.listItem} innerDivStyle={styles.listItemInner} primaryText="resources" leftIcon={<mui.FontIcon className="material-icons">local_library</mui.FontIcon>}
                initiallyOpen={true}
                nestedItems={[
                  <mui.ListItem key={0} style={styles.listItem} innerDivStyle={styles.listItemInner} primaryText="datasets" onClick={goDatasets} leftIcon={<mui.FontIcon className="material-icons">data_usage</mui.FontIcon>} />,
                  <mui.ListItem key={1} style={styles.listItem} innerDivStyle={styles.listItemInner} primaryText="iot feeds" onClick={goIOT} leftIcon={<mui.FontIcon className="material-icons">input</mui.FontIcon>} />,
                  <mui.ListItem key={2} style={styles.listItem} innerDivStyle={styles.listItemInner} primaryText="visualisations" onClick={goVisualise} leftIcon={<mui.FontIcon className="material-icons">dashboard</mui.FontIcon>} />,
                  <mui.ListItem key={3} style={styles.listItem} innerDivStyle={styles.listItemInner} primaryText="processes" onClick={goProcesses} leftIcon={<mui.FontIcon className="material-icons">developer_board</mui.FontIcon>} />
                ]}
        />
      <mui.ListItem key={1} style={styles.listItem} innerDivStyle={styles.listItemInner} primaryText="groups" onClick={goDatasets} leftIcon={<mui.FontIcon className="material-icons">group_work</mui.FontIcon>} />
      <mui.ListItem key={2} style={styles.listItem} innerDivStyle={styles.listItemInner} primaryText="connections" onClick={goConnections} leftIcon={<mui.FontIcon className="material-icons">supervisor_account</mui.FontIcon>} />
      <mui.ListItem key={3} style={styles.listItem} innerDivStyle={styles.listItemInner} primaryText="help" onClick={goHelp} leftIcon={<mui.FontIcon className="material-icons">help_outline</mui.FontIcon>} />
    </mui.List>;

    return sideBarMenu;
  }
});