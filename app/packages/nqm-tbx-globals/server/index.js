/**
 * Created by toby on 09/09/15.
 */

if (!nqmTBX) {
  nqmTBX = {};
}

if (!nqmTBX.helpers) {
  nqmTBX.helpers = {};
}

nqmTBX.helpers.getUserEmail = function(userIn) {
  var user = userIn || Meteor.user();
  var email;
  // TODO - add support for other authorization providers.
  if (user && user.services && user.services.google) {
    email = user.services.google.email;
  }
  return email;
};

nqmTBX.helpers.getUserURI = function(userIn) {
  var uri;
  var user = userIn || Meteor.user();
  if (user && user.username) {
    uri = Meteor.settings.public.rootURL + "/" + user.username
  }
  return uri;
};

nqmTBX.helpers.getUserAuthId = function(userIn) {
  var user = userIn || Meteor.user();
  var authId;
  // TODO - add support for other authorization providers.
  if (user && user.services && user.services.google) {
    authId = user.services.google.id;
  }
  return authId;
};
