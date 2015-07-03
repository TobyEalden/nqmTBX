Template.searchBrowseLayout.helpers({
  //add you helpers here
});

Template.searchBrowseLayout.events({
  "input, change, paste, keyup, mouseup #nqm-search": function(e, template) {
    if (e.type === "keyup" && e.which === 27) {
      $("#nqm-sub-nav").removeClass("hide");
      $("#nqm-search-row").addClass("hide");
    } else {
      Session.set("nqm-search", e.target.value);
    }
  },
  "blur #nqm-search": function(e, template) {
    $("#nqm-sub-nav").removeClass("hide");
    $("#nqm-search-row").addClass("hide");
  },
  "click #nqm-search-activate": function(event, template) {
    $("#nqm-sub-nav").addClass("hide");
    $("#nqm-search-row").removeClass("hide");
    $("#nqm-search").focus();
  }
});

Template.searchBrowseLayout.onCreated(function () {
  //add your statement here
});

Template.searchBrowseLayout.onRendered(function () {
  //add your statement here
});

Template.searchBrowseLayout.onDestroyed(function () {
  //add your statement here
});

