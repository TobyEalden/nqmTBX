const {
  AppCanvas,
  AppBar,
  DropDownMenu,
  DropDownIcon,
  MenuItem,
  LeftNav,
  List,
  ListItem,
  ListDivider,
  FontIcon,
  Paper,
  TextField,
  Toolbar,
  ToolbarGroup,
  ToolbarTitle,
  ToolbarSeparator,
  CircularProgress,
  RaisedButton,
  IconMenu,
  Menu,
  IconButton,
  Card,
  CardTitle,
  CardText
  } = mui;

let filterOptions = [
  { payload: '1', text: 'All Broadcasts' },
  { payload: '2', text: 'All Voice' },
  { payload: '3', text: 'All Text' },
  { payload: '4', text: 'Complete Voice' },
  { payload: '5', text: 'Complete Text' },
  { payload: '6', text: 'Active Voice' },
  { payload: '7', text: 'Active Text' },
];
let iconMenuItems = [
  { payload: '1', text: 'Download' },
  { payload: '2', text: 'More Info' }
];

TestPage = React.createClass({
  render: function() {
    var datasets = [
      { id: 1, name: "first", description: "first desc" },
      { id: 2, name: "second", description: "second desc" },
      { id: 3, name: "third", description: "third desc" },
      { id: 4, name: "fourth", description: "fourth desc" }
    ];
    var cards = datasets.map(function(ds) {
      return (
        <div style={{backgroundColor:"#ddd"}} key={ds.id} className="Grid-cell">
          <div>{ds.name}</div>
          <div>{ds.description}</div>
        </div>
      );
    });

    return (
      <div>
        <div>
          <p>testing 123</p>
          <p>testing 123</p>
          <p>testing 123</p>
          <p>testing 123</p>
        </div>
        <div className="Grid Grid--gutters Grid--full large-Grid--fit">{cards}</div>
      </div>
    );
  }
});