/**
 * Created by toby on 03/07/15.
 */

Template.modalLayout.events({
  "click #nqm-modal-back": function(e, template) {
    Router.go(Session.get("modalBackLocation"));
    return false;
  }
});