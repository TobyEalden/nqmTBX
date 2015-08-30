/**
 * Created by toby on 29/08/15.
 */

const {
  Card,
  CardText,
  CardTitle,
  TextField,
  RaisedButton
  } = mui;

EditDataset = React.createClass({
  render: function() {
   return (
     <Card className="Grid-cell" style={{minWidth: 300 }}>
       <CardTitle title="Login"/>

       <form>
         <CardText>
           <div>
             <TextField hintText="email" floatingLabelText="email"/>
           </div>
           <div>
             <TextField type="password" hintText="password" floatingLabelText="Password"/>
           </div>
         </CardText>
         <CardActions>
           <RaisedButton label="Login" primary={true} onClick={this.doLogin} />
         </CardActions>
       </form>
     </Card>
   );
  }
});