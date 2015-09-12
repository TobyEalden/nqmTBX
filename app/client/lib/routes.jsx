/**
 * Created by toby on 25/08/15.
 */

var globalEnterRoute = function(context) {
  Session.set("nqm-current-route",context.route.name);
};

FlowRouter.triggers.enter([globalEnterRoute]);

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
  name: "datasets",
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

FlowRouter.route("/dataset/view/:id", {
  name: "datasetView",
  action: function(params) {
    ReactLayout.render(ModalLayout, { content: function() { return <nqmTBX.pages.DatasetViewPage datasetId={params.id} /> } });
  }
});

FlowRouter.route("/visualise", {
  name: "visualise",
  action: function () {
    ReactLayout.render(MainLayout, { content: function() { return <VisualisePage />; } });
  }
});

FlowRouter.route("/connections", {
  name: "connections",
  action: function() {
    ReactLayout.render(MainLayout, { content: function() { return <nqmTBX.pages.ZoneConnections />; } });
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

FlowRouter.route("/test", {
  action: function() {
    ReactLayout.render(UnauthLayout,{ content: function() { return <TestPage />; } });
  }
});