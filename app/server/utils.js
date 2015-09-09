/**
 * Created by toby on 29/08/15.
 */

nqmTBX.helpers = {
  getUserEmail: function(userIn) {
    var user = userIn || Meteor.user();
    var email;
    if (user && user.services && user.services.google) {
      email = user.services.google.email;
    }
    return email;
  },
  getUserURI: function(userIn) {
    var uri;
    var user = userIn || Meteor.user();
    if (user && user.username) {
      uri = Meteor.settings.public.rootURL + "/" + user.username
    }
    return uri;
  },
  isEmailValid: function(address) {
    // TODO - improve this (use mailgun?)
    return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(address);
  }
};

