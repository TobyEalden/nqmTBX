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
    ReactLayout.render(MainLayout, { content: function() { return <nqmTBX.pages.Datasets />; } });
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
   ReactLayout.render(MainLayout, { content: function() { return <nqmTBX.pages.Datasets />; } });
  }
});

FlowRouter.route("/dataset/create", {
  name: "datasetCreate",
  action: function(params) {
    ReactLayout.render(ModalLayout, { content: function() { return <nqmTBX.pages.DatasetEdit />; } });
  }
});

FlowRouter.route("/dataset/edit/:id", {
  name: "datasetEdit",
  action: function(params) {
    ReactLayout.render(ModalLayout, { content: function() { return <nqmTBX.pages.DatasetEdit datasetId={params.id} />; } });
  }
});

FlowRouter.route("/resource/share/:type/:id", {
  name: "resourceShare",
  action: function(params) {
    ReactLayout.render(ModalLayout, { content: function() { return <nqmTBX.pages.ResourceShare resourceId={params.id} type={params.type} /> } });
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
    ReactLayout.render(MainLayout, { content: function() { return <nqmTBX.pages.Visualise />; } });
  }
});

FlowRouter.route("/visualise/create", {
  name: "visualCreate",
  action: function(params) {
    ReactLayout.render(ModalLayout, { content: function() { return <nqmTBX.pages.VisualEdit />; } });
  }
});

FlowRouter.route("/visualise/edit/:id", {
  name: "visualEdit",
  action: function(params) {
    ReactLayout.render(ModalLayout, { content: function() { return <nqmTBX.pages.VisualEdit resourceId={params.id} />; } });
  }
});

FlowRouter.route("/visualise/:id", {
  name: "visualView",
  action: function(params) {
    ReactLayout.render(ModalLayout, { content: function() { return <nqmTBX.pages.VisualView resourceId={params.id} />; } });
  }
});

FlowRouter.route("/visualise/:id/addWidget", {
  name: "visualAddWidget",
  action: function(params) {
    ReactLayout.render(ModalLayout, { content: function() { return <nqmTBX.pages.VisualAddWidget resourceId={params.id} />; } });
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