/**
 * Created by toby on 25/08/15.
 */

FlowRouter.route("/", {
  action: function() {
    ReactLayout.render(MainLayout, { content: function() { return <DatasetsPage />; } });
  }
});

FlowRouter.route("/logout", {
  action: function() {
    Meteor.logout();
  },
  triggersExit: [function(context,redirect) {
    redirect("/");
  }]
});

FlowRouter.route("/datasets", {
  action: function() {
   ReactLayout.render(MainLayout, { content: function() { return <DatasetsPage />; } });
  }
});

FlowRouter.route("/visualise", {
  action: function () {
    ReactLayout.render(MainLayout, { content: function() { return <VisualisePage />; } });
  }
});

FlowRouter.route("/trusted", {
  action: function() {
    ReactLayout.render(MainLayout, { content: function() { return <TrustedUserPage />; } });
  }
});

FlowRouter.route("/:uid/authenticate", {
  name: "shareAuth",
  action: function() {
    localStorage.clear();
    ReactLayout.render(UnauthLayout,{ content: function() { return <ShareAuthPage />; } });
  }
});

FlowRouter.route("/test", {
  action: function() {
    ReactLayout.render(UnauthLayout,{ content: function() { return <TestPage />; } });
  }
});