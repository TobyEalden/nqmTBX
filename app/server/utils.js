/**
 * Created by toby on 29/08/15.
 */

getUserEmail = function(userIn) {
  var user = userIn || Meteor.user();
  var email;
  if (user && user.services && user.services.google) {
    email = user.services.google.email;
  }

  return email;
};