Template.searchBrowseLayout.helpers({
  searchTerm: function() {
    return Session.get("nqm-search");
  }
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
  Session.set("nqm-search","");
});

Template.searchBrowseLayout.onRendered(function () {
  $(".button-collapse").sideNav({
    closeOnClick: true
  });

  $('.collapsible').collapsible({
    accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
  });
});

Template.searchBrowseLayout.onDestroyed(function () {
});

