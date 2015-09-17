
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
        width: "200px",  
        position: "absolute",
        left: "0px",
        top: "56px",
        bottom: "0px",
        overflowY: "auto",
        backgroundColor: appPalette.canvasColor
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
      },
      icon: {
        color: appPalette.textColor
      }
    };

    var sideBarList = [
      {
        text: "datasets",
        route: "datasets",
        icon: "data_usage",
        initiallyOpen: false,
        children: [
          {
            text: "iot",
            icon: "folder"
          },
          {
            text: "obesity",
            icon: "folder"
          },
          {
            text: "smart cities",
            icon: "location_city"
          },
          {
            text: "youth homelessness",
            icon: "folder"
          },
        ]
      },
      {
        text: "visualisations",
        route: "visualise",
        icon: "widgets",
      },
      {
        text: "processes",
        route: "processes",
        icon: "developer_board",
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
          leftIcon={<mui.FontIcon style={styles.icon} className="material-icons"> {listData.icon}</mui.FontIcon>} 
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
          leftIcon={<mui.FontIcon style={styles.icon} className="material-icons">{listData.icon}</mui.FontIcon>} />  
      }
      return listItem;
    }

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