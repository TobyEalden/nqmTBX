/**
 * Created by toby on 05/08/15.
 */

Template.createAccount.onCreated(function() {

});

Template.createAccount.helpers({
  suggestedAccount: function() {
    return Meteor.user().profile.name.replace(/ /g,".");
  }
});

Template.createAccount.events({
  "click #createButton": function(event, template) {
    var accountName = $("#account").val();
    Meteor.call("/app/account/create", accountName, function(err, result) {
      if (result.error) {
        err = new Error(result.error);
      }
      if (err) {
        nqmTBX.ui.notification("create account failed: " + err.message);
      }
      if (result && result.ok) {
        nqmTBX.ui.notification("account created");
      }
    });
  }
});
