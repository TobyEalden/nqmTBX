/**
 * Created by toby on 19/06/15.
 */

Template.logout.onCreated(function() {
  Session.set("logoutTimer", "");
});

Template.logout.helpers({
  dots: function() {
    return Session.get("logoutTimer");
  }
});

Template.logout.onRendered(function() {
  var interval = Meteor.setInterval(function() {
    var dots = Session.get("logoutTimer");
    Session.set("logoutTimer", dots + ".");
  },1000);
  Meteor.setTimeout(function() {
    Meteor.clearInterval(interval);
    Meteor.logout();
    Router.go("/");
  },4000);
});