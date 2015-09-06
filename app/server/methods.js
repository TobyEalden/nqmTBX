/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/

var jwt = Meteor.npmRequire("jwt-simple");

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
    if (opts.id) {
      // Validate that the current user owns the dataset
      var target = datasets.findOne({id: opts.id});
      if (!target || target.owner !== opts.owner) {
        throw new Error("permission denied");
      }
    } else {
      opts.shareMode = "private";
    }
    var result = HTTP.post(
      Meteor.settings.commandURL + "/command/dataset/" + (opts.id ? "update" : "create"),
      { data: opts }
    );
    console.log("result is %j",result.data);
    if (!result.data.ok) {
      throw new Error(result.data.error || "call failed");
    }
    return result.data;
  } catch (e) {
    console.log("dataset save failed: %s", e.message);
    throw e;
  }
};

var setDatasetShareMode = function(id, mode) {
  try {
    // TODO - security check.
    var result = HTTP.post(
      Meteor.settings.commandURL + "/command/dataset/setShareMode",
      { data: { id: id, shareMode: mode } }
    );
    console.log("result is %j",result.data);
    return result.data;
  } catch (e) {
    console.log("dataset setShareMode failed: %s", e.message);
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
    var result;
    var user = Meteor.user();

    if (user) {
      // Replace spaces with period.
      name = name.replace(/ /g,".");

      var existing = Meteor.users.findOne({username: name});
      if (existing) {
        throw new Error("user already exists with name: " + name);
      }
      result = HTTP.post(
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
        Meteor.users.update(user._id, { $set: { username: name, nqmId: name } });

        // Add a self-referencing trusted user.
        result.data = createTrustedUser({
          userId: getUserEmail(),
          serviceProvider: "google",
          issued: Date.now(),
          expires: (new Date(8640000000000000)).getTime(),
          status: "trusted"
        });
      }
    } else {
      if (!user) {
        throw new Error("no user logged in");
      } else {
        throw new Error("user already has account: " + user.username);
      }
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
    console.log("create trusted user failed: %s", e.message);
    return { ok: false, error: e.message };
  }
};

var setTrustedStatus = function(id, status) {
  try {
    var target = trustedUsers.findOne({ id: id });
    if (target && target.owner === Meteor.user().nqmId) {
      var result = HTTP.post(
        Meteor.settings.commandURL + "/command/trustedUser/setStatus",
        { data: { id: id, status: status } }
      );
      console.log("result is %j",result.data);
      return result.data;
    } else {
      throw new Error("id not found: " + id);
    }
  } catch (e) {
    console.log("set trusted status failed: %s", e.message);
    return { ok: false, error: e.message };
  }
};

var deleteTrustedUser = function(id) {
  try {
    var target = trustedUsers.findOne({ id: id });
    if (target && target.owner === Meteor.user().nqmId) {
      var result = HTTP.post(
        Meteor.settings.commandURL + "/command/trustedUser/delete",
        { data: { id: id } }
      );
      console.log("result is %j",result.data);
      return result.data;
    } else {
      throw new Error("id not found: " + id);
    }
  } catch (e) {
    console.log("delete trusted user failed: %s", e.message);
    return { ok: false, error: e.message };
  }
};

var createShareToken = function(opts) {
  try {
    opts.owner = Meteor.user().nqmId;
    // Get the target trusted user.
    var target = trustedUsers.findOne({ userId: opts.userId, status: "trusted" });
    if (target) {
      var result = HTTP.post(
        Meteor.settings.commandURL + "/command/shareToken/create",
        { data: opts }
      );
      console.log("result is %j",result.data);
      return result.data;
    } else {
      throw new Error("invalid arguments");
    }
  } catch (e) {
    console.log("createShareToken failed %s", e.message);
    return { ok: false, error: e.message };
  }
};

var deleteShareToken = function(id) {
  try {
    // Get the target trusted user.
    var target = shareTokens.findOne({ id: id });
    if (target && target.owner === Meteor.user().nqmId) {
      var result = HTTP.post(
        Meteor.settings.commandURL + "/command/shareToken/delete",
        { data: { id: id } }
      );
      console.log("result is %j",result.data);
      return result.data;
    } else {
      throw new Error("invalid arguments");
    }
  } catch (e) {
    console.log("deleteShareToken failed %s", e.message);
    return { ok: false, error: e.message };
  }
};

var createApiToken = function(authToken) {
  try {
    var jt = jwt.decode(authToken, Meteor.settings.APIKey);
    if (jt.exp <= Date.now()) {
      // Token has expired.
      throw new Error("auth token expired");
    }

    // Get the email address of the currently logged in user.
    var email = getUserEmail();

    // Make sure the currently logged in user is trusted by the token issuer.
    var target = trustedUsers.findOne({ owner: jt.iss, userId: email, status: "trusted", expires: { $gt: new Date() } });
    if (target) {
      //var result = HTTP.post(
      //  Meteor.settings.commandURL + "/command/apiToken/create",
      //  {
      //    data: {
      //      userId: target.id,
      //
      //      issued: Date.now(),
      //      expires: Date.now() + 10*60*1000  // 10 mins?
      //    }
      //  }
      //);
      //console.log("result is %j",result.data);
      //return result.data;
      var apiToken = jwt.encode({
        iss: jt.iss,
        sub: target.id,
        exp: moment().add(Meteor.settings.apiTokenTimeout, "minutes").valueOf(),
        referer: jt.referer,
        subId: Meteor.user().nqmId
      }, Meteor.settings.APIKey);
      console.log("api token is %s",apiToken);
      return { ok: true, token: apiToken };
    } else {
      throw new Error(jt.iss + " does not trust " + email);
    }
  } catch (e) {
    console.log("createApiToken failed %s", e.message);
    return { ok: false, error: e.message };
  }
};

var tokenLogin = function(provider, token) {
  var userInfo;

  if (provider === "google") {
    try {
      var result = HTTP.get("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + token);
      userInfo = {
        email: result.data.email
      };

      var user = Meteor.users.findOne({"services.google.email": result.data.email });

      // Create a token and add it to the user
      var stampedToken = Accounts._generateStampedLoginToken();
      var hashStampedToken = Accounts._hashStampedToken(stampedToken);

      Meteor.users.update(user._id, {$push: {'services.resume.loginTokens': hashStampedToken}});

      //var pwd = Meteor.uuid();
      //Accounts.setPassword(user._id, pwd, { logout: false });

      return stampedToken.token;
    } catch (e) {
      console.log("failed to get token info from google: " + e.message);
    }
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
  "/app/dataset/setShareMode": function(id, mode) {
    this.unblock();
    return setDatasetShareMode(id, mode);
  },
  "/app/account/create": function(name) {
    this.unblock();
    return createUserAccount(name);
  },
  "/app/trustedUser/create": function(opts) {
    this.unblock();
    return createTrustedUser(opts);
  },
  "/app/trustedUser/setStatus": function(id,status) {
    this.unblock();
    return setTrustedStatus(id, status);
  },
  "/app/trustedUser/delete": function(id) {
    this.unblock();
    return deleteTrustedUser(id);
  },
  "/app/share/create": function(opts) {
    this.unblock();
    return createShareToken(opts);
  },
  "/app/share/delete": function(id) {
    this.unblock();
    return deleteShareToken(id);
  },
  "/api/token/create": function(authToken) {
    this.unblock();
    return createApiToken(authToken);
  },
  "/app/auth": function(provider, token) {
    this.unblock();
    return tokenLogin(provider, token);
  }
});
