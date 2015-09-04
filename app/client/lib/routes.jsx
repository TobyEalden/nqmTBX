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

FlowRouter.route("/dataset/edit", {
  name: "datasetEdit",
  action: function(params) {
    ReactLayout.render(UnauthLayout, { content: function() { return <DatasetEditPage />; } });
  }
});

FlowRouter.route("/dataset/share/:id", {
  name: "datasetShare",
  action: function(params) {
    ReactLayout.render(ModalLayout, { content: function() { return <DatasetSharePage datasetId={params.id} /> }});
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

FlowRouter.route("/createTrustedUser", {
  action: function() {
    ReactLayout.render(ModalLayout, { content: function() { return <EditTrustedUserPage />; } });
  }
});

var authExit = function(context, redirect) {
  debugger;
};

FlowRouter.route("/authenticate/:jwt", {
  name: "shareAuth",
  action: function() {
    ReactLayout.render(UnauthLayout,{ content: function() { return <ShareAuthPage />; } });
  },
  triggersExit: [authExit]
});

FlowRouter.route("/test", {
  action: function() {
    ReactLayout.render(UnauthLayout,{ content: function() { return <TestPage />; } });
  }
});