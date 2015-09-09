/**
 * Created by toby on 25/08/15.
 */

nqmTBX.helpers.neverExpire = moment().year(270000).startOf("year");

Meteor.startup(function() {
  injectTapEventPlugin();
  //React.render(<App />, document.getElementById("container"));
});