/**
 * Created by toby on 25/08/15.
 */

FlowRouter.route("/error/:statusCode", {
  name: "error",
  action: function(params) {
    ReactLayout.render(UnauthLayout, { content: function() { return <nqmTBX.pages.ErrorPage statusCode={params.statusCode} /> }});
  }
});

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

FlowRouter.route("/dataset/create", {
  name: "datasetCreate",
  action: function(params) {
    ReactLayout.render(ModalLayout, { content: function() { return <DatasetEditPage />; } });
  }
});

FlowRouter.route("/dataset/edit/:id", {
  name: "datasetEdit",
  action: function(params) {
    ReactLayout.render(ModalLayout, { content: function() { return <DatasetEditPage datasetId={params.id} />; } });
  }
});

FlowRouter.route("/dataset/share/:id", {
  name: "datasetShare",
  action: function(params) {
    ReactLayout.render(ModalLayout, { content: function() { return <nqmTBX.pages.DatasetSharePage datasetId={params.id} /> } });
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
  //debugger;
};

FlowRouter.route("/authenticate/:jwt", {
  name: "shareAuth",
  action: function() {
    ReactLayout.render(UnauthLayout,{ content: function() { return <ShareAuthPage />; } });
  },
  triggersEnter: [authExit],
  triggersExit: [authExit]
});

FlowRouter.route("/requestAccess/:jwt", {
  name: "requestAccess",
  action: function(params) {
    ReactLayout.render(UnauthLayout, { content: function() { return <nqmTBX.pages.RequestAccessPage jwt={params.jwt} />; } });
  }
});

FlowRouter.route("/trustedBy/:jwt", {
  name: "trustedBy",
  action: function() {
    ReactLayout.render(UnauthLayout, { content: function() { return <nqmTBX.pages.TrustedByPage />; } });
  }
});

FlowRouter.route("/test", {
  action: function() {
    ReactLayout.render(UnauthLayout,{ content: function() { return <TestPage />; } });
  }
});