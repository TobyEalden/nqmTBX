/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/

var saveIOTHub = function(isNew, opts) {
  try {
    var result = HTTP.post(
      Meteor.settings.commandURL + "/command/iot/hub/" + (isNew ? "create" : "update"),
      { data: opts }
    );
    console.log("result is %j",result.data);
    return result.data;
  } catch (e) {
    console.log("failed: %s", e.message);
    return { ok: false, error: e.message };
  }
};

var saveIOTFeed = function(isNew, opts) {
  try {
    var result = HTTP.post(
      Meteor.settings.commandURL + "/command/iot/feed/" + (isNew ? "create" : "update"),
      { data: opts }
    );
    console.log("result is %j",result.data);
    return result.data;
  } catch (e) {
    console.log("failed: %s", e.message);
    return { ok: false, error: e.message };
  }
};

var deleteFeed = function(hubId, id) {
  try {
    var result = HTTP.post(
      Meteor.settings.commandURL + "/command/iot/feed/delete",
      { data: { hubId: hubId, id: id } }
    );
    console.log("result is %j",result.data);
    return result.data;
  } catch (e) {
    console.log("feed delete failed: %s", e.message);
    return { ok: false, error: e.message };
  }
};

var saveDataset = function(opts) {
  try {
    opts.owner = Meteor.user().nqmId;
    var result = HTTP.post(
      Meteor.settings.commandURL + "/command/dataset/" + (opts.id ? "update" : "create"),
      { data: opts }
    );
    console.log("result is %j",result.data);
    return result.data;
  } catch (e) {
    console.log("dataset save failed: %s", e.message);
    return { ok: false, error: e.message };
  }
};

var deleteDataset = function(id) {
  try {
    var result = HTTP.post(
      Meteor.settings.commandURL + "/command/dataset/delete",
      { data: { id: id } }
    );
    console.log("result is %j",result.data);
    return result.data;
  } catch (e) {
    console.log("dataset delete failed: %s", e.message);
    return { ok: false, error: e.message };
  }
};

var createUserAccount = function(name) {
  try {
    var user = Meteor.user();
    var result = HTTP.post(
      Meteor.settings.commandURL + "/command/account/create",
      {
        data: {
          id: name,
          authId: user.services.google.id
        }
      }
    );

    if (result.data && result.data.ok) {
      // Save the nqmId with the default meteor User document.
      Meteor.users.update(user._id, { $set: { nqmId: name } });
    }

    return result.data;
  } catch (e) {
    console.log("failed to create user account: %s", e.message);
    return { ok: false, error: e.message };
  }
};

var createTrustedUser = function(params) {
  try {
    params.owner = Meteor.user().nqmId;
    var result = HTTP.post(
      Meteor.settings.commandURL + "/command/trustedUser/create",
      { data: params }
    );
    console.log("result is %j",result.data);
    return result.data;
  } catch (e) {
    console.log("dataset save failed: %s", e.message);
    return { ok: false, error: e.message };
  }
};

var setTrustedStatus = function(acceptId, status) {
  try {
    var target = trustedUsers.findOne({ id: acceptId });
    if (target && target.owner === Meteor.user().nqmId) {
      var result = HTTP.post(
        Meteor.settings.commandURL + "/command/trustedUser/setStatus",
        { data: { id: acceptId, status: status } }
      );
      console.log("result is %j",result.data);
      return result.data;
    } else {
      throw new Error("not authorised");
    }
  } catch (e) {
    console.log("set trusted status failed: %s", e.message);
    return { ok: false, error: e.message };
  }
};

Meteor.methods({
  "/app/widget/add": function(widget) {
    var widgetType = widgetTypes.findOne({ name: widget.type});
    if (widgetType) {
      console.log("adding widget of type: " + widget.type);
      var newWidget = widgets.insert(widget);
      return newWidget._id;
    } else {
      console.log("unknown widget type: " + widget.type);
      throw new Error("unknown widget type: " + widget.type);
    }
  },
  "/app/widget/updatePosition": function(widget) {
    return widgets.update({_id: widget._id}, { $set: { position: widget.position } });
  },
  "/app/widget/remove": function(widgetId) {
    return widgets.remove({_id: widgetId});
  },
  "/app/iothub/create": function(opts) {
    this.unblock();
    return saveIOTHub(true, opts);
  },
  "/app/iothub/update": function(opts) {
    this.unblock();
    return saveIOTHub(false, opts);
  },
  "/app/iotfeed/create": function(opts) {
    this.unblock();
    return saveIOTFeed(true, opts);
  },
  "/app/iotfeed/update": function(opts) {
    this.unblock();
    return saveIOTFeed(false, opts);
  },
  "/app/iotfeed/delete": function(opts) {
    this.unblock();
    return deleteFeed(opts.hubId, opts.id);
  },
  "/app/dataset/create": function(opts) {
    this.unblock();
    return saveDataset(opts);
  },
  "/app/dataset/update": function(opts) {
    this.unblock();
    return saveDataset(opts);
  },
  "/app/dataset/delete": function(id) {
    this.unblock();
    return deleteDataset(id);
  },
  "/app/account/create": function(name) {
    this.unblock();
    return createUserAccount(name);
  },
  "/app/trustedUser/create": function(opts) {
    this.unblock();
    return createTrustedUser(opts);
  },
  "/app/trustedUser/setStatus": function(acceptId,status) {
    this.unblock();
    return setTrustedStatus(acceptId, status);
  }
});
