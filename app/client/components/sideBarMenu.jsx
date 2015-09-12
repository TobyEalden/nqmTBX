
nqmTBX.SideBarMenu = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      currentRoute: Session.get("nqm-current-route")
    }
  },
  propTypes: {
    onToggle: React.PropTypes.func
  },
  getInitialState: function() {
    return {
    }
  },
  _goRoute: function(listData) {
    if (listData.route) {
      FlowRouter.go(listData.route, {});
    } else {
      console.log("sideBarMenu => no route specified for list item");
    }
  },
  render: function() {
    var self = this;

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
      listItemActive: {
        fontSize: 14,
        backgroundColor: appPalette.accent1Color
      },     
      listItemInner: {
        paddingLeft: 48
      }
    };

    var sideBarList = [
      { 
        text: "resources", 
        icon: "local_library", 
        initiallyOpen: true,
        children: [
          {
            text: "datasets",
            route: "datasets",
            icon: "data_usage",
          },
          {
            text: "iot feeds",
            route: "iot",
            icon: "input",
          },
          {
            text: "visualisations",
            route: "visualise",
            icon: "dashboard",
          },
          {
            text: "processes",
            route: "processes",
            icon: "developer_board",
          }
        ]
      },
      {
        text: "connections",
        route: "connections",
        icon: "supervisor_account",
      },
      {
        text: "help",
        route: "",
        icon: "help_outline",
      }
    ];

    var getList = function(listData) {
      var listItem;
      if (listData.children && listData.children.length > 0) {
        var children = [];
        _.each(listData.children, function(li) {
          children.push(getList(li));
        });
        listItem = <mui.ListItem 
          key={listData.route || Random.id()} 
          style={listData.route === self.data.currentRoute ? styles.listItemActive : styles.listItem} 
          innerDivStyle={styles.listItemInner} 
          primaryText={listData.text} 
          leftIcon={<mui.FontIcon className="material-icons"> {listData.icon}</mui.FontIcon>} 
          initiallyOpen={listData.initiallyOpen ? true : false}
          onClick={listData.click ? listData.click : self._goRoute.bind(self,listData)} 
          nestedItems={children} />
      } else {
        listItem = <mui.ListItem 
          key={listData.route || Random.id()} 
          style={listData.route === self.data.currentRoute ? styles.listItemActive : styles.listItem} 
          innerDivStyle={styles.listItemInner} 
          primaryText={listData.text} 
          onClick={listData.click ? listData.click : self._goRoute.bind(self,listData)} 
          leftIcon={<mui.FontIcon className="material-icons">{listData.icon}</mui.FontIcon>} />  
      }
      return listItem;
    }

    /*
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
    */

    var menu = [];
    _.each(sideBarList, function(li) {
      menu.push(getList(li));
    });

    return (
      <mui.List style={ styles.root } >
        {menu}
      </mui.List>
    );
  }
});