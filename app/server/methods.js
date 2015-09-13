/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/

var jwt = Meteor.npmRequire("jwt-simple");
var util = Meteor.npmRequire("util");

var sendCommand = function(cmd, data) {
  return HTTP.post(Meteor.settings.commandURL + cmd, { data: data });
};

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
      // Default new datasets to 'private'.
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
    throw new Meteor.Error("saveDataset",e.message);
  }
};

var setDatasetShareMode = function(id, mode) {
  try {
    var owner = Meteor.user().username;
    // Validate that the current user owns the dataset
    var target = datasets.findOne({id: id});
    if (!target || target.owner !== owner) {
      throw new Error("permission denied");
    }
    var result = HTTP.post(
      Meteor.settings.commandURL + "/command/dataset/setShareMode",
      { data: { id: id, shareMode: mode } }
    );
    console.log("result is %j",result.data);
    return result.data;
  } catch (e) {
    console.log("dataset setShareMode failed: %s", e.message);
    throw new Meteor.Error("setDatasetShareMode",e.message);
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

      var existing = accounts.findOne({id: name});
      if (existing && existing.authId !== nqmTBX.helpers.getUserAuthId()) {
        throw new Error("user already exists with name: " + name);
      }
      result = HTTP.post(Meteor.settings.commandURL + "/command/account/create", { data: { id: name, email: nqmTBX.helpers.getUserEmail(), authId: user.services.google.id } });

      if (result.data && result.data.ok) {
        // Save the nqmId with the default meteor User document.
        // TODO - remove nqmId in favour of username.
        Meteor.users.update(user._id, { $set: { username: name, nqmId: name, email: nqmTBX.helpers.getUserEmail() } });

        //// Add a self-referencing trusted zone.
        //result.data = createZoneConnection({
        //  otherEmail: nqmTBX.helpers.getUserEmail(),
        //  expires: 525600000,
        //  notify: false
        //});
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

var createZoneConnection = function(params) {
  check(params,{
    otherEmail: String,
    expires: Match.Optional(Number),
    notify: Match.Optional(Boolean)
  });

  try {
    params.expires = params.expires || 3600;
    var notify = (typeof params.notify === "undefined") ? true : params.notify;

    var data = {
      owner: Meteor.user().username,
      ownerEmail: nqmTBX.helpers.getUserEmail(),
      ownerServer: Meteor.settings.public.rootURL,
      otherEmail: params.otherEmail,
      issued: moment().valueOf(),
      expires: moment().add(params.expires,"minutes").valueOf()
    };

    var existing = zoneConnections.findOne({owner: data.owner, otherEmail: data.otherEmail, expires: {$gt: new Date() }, status: {$ne: "revoked"}});
    if (existing) {
      // There is already a valid zone connection.
      throw new Error("zone connection already exists");
    }

    // Send create command.
    var result = HTTP.post(Meteor.settings.commandURL + "/command/zoneConnection/create",{ data: data });

    // Send a notification e-mail to the newly trusted zone
    if (result.data && result.data.ok && notify) {
      // Send the target zone an email with a token for acknowledging/reciprocating the trust.
      var connectToken = {
        iss: result.data.result.id, // Issuer is the ID of the connection request.
        sub: data.ownerEmail
      };
      var encodedToken = jwt.encode(connectToken,Meteor.settings.APIKey);
      console.log("emailing token %s to %s", encodedToken, data.otherEmail);
      Email.send({
        to: data.otherEmail,
        from: Meteor.settings.emailFromAddress,
        subject: "nquiringMinds zone connection",
        html:
        "<p>" + data.owner + " has added you as a trusted connection.</p>" +
        "<p>In order to be able to access any resources that " + data.owner + " shares with you go to the nquireToolbox connections page, click on the 'trusting me' tab and accept the connection.</p>" +
        "<p>Note that none of you private data will be visible to " + data.owner + " unless you explicitly share resource(s) with them</p>"
      });
    }
    console.log("result is %j",result.data);
    return result.data;

  } catch (e) {
    console.log("createZoneConnection failed: %s",e.message);
    throw new Meteor.Error("createZoneConnection",e.message);
  }
};

var acceptZoneConnection = function(params) {
  check(params,{
    id: String
  });

  try {
    // Update the status of an existing zoneConnection.
    var existing = zoneConnections.findOne({id: params.id});
    if (!existing) {
      throw new Error("zone connection not found: " + params.id);
    }
    if (existing.otherEmail !== nqmTBX.helpers.getUserEmail()) {
      throw new Error("zone connection wrong target");
    }
    if (existing.expires <= new Date()) {
      throw new Error("zone connection expired: " + params.id);
    }
    var data = {
      id: params.id,
      other: Meteor.user().username,
      otherServer: Meteor.settings.public.rootURL
    };

    // Send accept command.
    var result = HTTP.post(Meteor.settings.commandURL + "/command/zoneConnection/accept",{ data: data });
    console.log("result is %j",result.data);
    return result.data;
  } catch (e) {
    console.log("acceptZoneConnection failed: %s",e.message);
    throw new Meteor.Error("acceptZoneConnection",e.message);
  }
};

var removeZoneConnection = function(id) {
  check(id,String);

  try {
    // Update the status of an existing zoneConnection.
    var existing = zoneConnections.findOne({id: id});
    if (!existing) {
      throw new Error("zone connection not found: " + id);
    }
    if (existing.owner !== Meteor.user().username && existing.otherEmail !== Meteor.user().email) {
      throw new Error("permission denied");
    }

    // Send delete command.
    var result = HTTP.post(Meteor.settings.commandURL + "/command/zoneConnection/delete",{ data: { id: id } });
    console.log("result is %j",result.data);
    return result.data;
  } catch (e) {
    console.log("removeZoneConnection failed: %s",e.message);
    throw new Meteor.Error("removeZoneConnection",e.message);
  }
};

/*
 * Creates a trusted share token.
 * The resource owner is the authenticated user.
 */
var createTrustedShareToken = function(userId, scope, access, expiry) {
  check(userId, String);
  check(scope, String);
  check(access, String);
  check(expiry, Number);

  try {
    if (!Meteor.user() || !Meteor.user().username) {
      throw new Error("permission denied");
    }

    var opts = {};

    // The token owner is the authenticated user.
    opts.owner = Meteor.user().username;

    // Make sure there is a valid trusted user.
    var trustedZone = zoneConnections.findOne({ owner: opts.owner, otherEmail: userId, status: {$in: ["trusted","issued"]}, expires: {$gt: new Date()} });
    if (trustedZone) {
      // Check to see if a share already exists.
      var existing = shareTokens.findOne({ owner: opts.owner, userId: userId, scope: scope, "resources.resource": "access", "resources.actions": access, expires: {$gt: new Date()}, status: "trusted"  });
      if (existing) {
        throw new Error(util.format("share exists between %s and %s for %s",opts.owner,userId,scope));
      }

      // The owner is authenticated and the target user is trusted.
      opts.status = "trusted";
      opts.userId = userId;
      opts.scope = scope;
      opts.resources = [ { resource: "access", actions: [access] } ];
      opts.issued = moment().valueOf();
      opts.expires = moment().add(expiry, "minutes").valueOf();
      var result = HTTP.post(Meteor.settings.commandURL + "/command/shareToken/create",{ data: opts });
      console.log("result is %j",result.data);
      return result.data;
    } else {
      throw new Error("trusted zone not found");
    }
  } catch (e) {
    console.log("createTrustedShareToken failed %s", e.message);
    throw new Meteor.Error("createTrustedShareToken",e.message);
  }
};

var createShareTokenRequest = function(authToken) {
  check(authToken,String);
  try {
    if (!Meteor.user() || !Meteor.user().username) {
      throw new Error("permission denied");
    }

    var jt = jwt.decode(authToken, Meteor.settings.APIKey);
    if (jt.exp <= Date.now()) {
      // Token has expired.
      throw new Error("share request auth token expired");
    }

    // Get the email address of the currently logged in user.
    var email = nqmTBX.helpers.getUserEmail();

    // Make sure the currently logged in user is trusted by the token issuer.
    var trustedZone = zoneConnections.findOne({ owner: jt.iss, otherEmail: email, status: "trusted", expires: {$gt: new Date()} });
    if (trustedZone) {
      var data = {
        owner: jt.iss,
        userId: email,
        scope: jt.subId,
        resources: [ { resource: "access", actions: ["read"] } ],
        status: "pending",
        issued: moment().valueOf(),
        expires: moment().add(Meteor.settings.shareTokenRequestExpiry, "minutes").valueOf()
      };
      var result = HTTP.post(Meteor.settings.commandURL + "/command/shareToken/create",{ data: data });
      console.log("result is %j",result.data);
      return result.data;
    } else {
      throw new Error("no trusted zone");
    }
  } catch (e) {
    console.log("createShareTokenRequest failed - %s", e.message);
    throw new Meteor.Error("createShareTokenRequest",e.message);
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

/******************************************************************************
* Create an API token based on a token received from authentication step.
*
* Incoming authenticateToken contains an issuer id which corresponds to the id
* of the zone that issued the token.
*
* The returned API token grants permission to the currently logged in zone to
* access resources owned by the issuer of the authentication token.
*
* The API token in itself does not permit access to any resources, a shareToken
* must exist for a given resource in order to permit access.
*
* The issuing zone must trust the current zone in order for an API token to be 
* granted.
*
******************************************************************************/
var createApiToken = function(authenticateToken) {
  try {
    // Decode the incoming authentication token.
    var authToken = jwt.decode(authenticateToken, Meteor.settings.APIKey);
    if (!authToken.exp || authToken.exp <= Date.now()) {
      // Authentication token has expired.
      throw new Error("auth token expired");
    }

    // Get the email address of the currently logged in zone.
    var email = nqmTBX.helpers.getUserEmail();

    // Make sure the currently logged in zone is trusted by the token issuer.
    var trustedZone = zoneConnections.findOne({ owner: authToken.iss, otherEmail: email, status: "trusted", expires: { $gt: new Date() } });
    if (trustedZone || authToken.iss === nqmTBX.helpers.getUserId()) {
      // Create the token data.
      var apiToken = {
        iss: authToken.iss,                   // Issuer is owner of the resource
        sub: email,                           // Subject is the email of the claimant
        subId: nqmTBX.helpers.getUserId(),    // Subject id is the id of the claimant
        ref: authToken.ref,                   // Referer is the IP address of the claimaint.
        jti: Random.id(),                     // ID of this token.
        exp: moment().add(Meteor.settings.apiTokenTimeout, "minutes").valueOf(),        
      };
      // Save the token.
      var result = sendCommand("/command/apiToken/create",apiToken);
      console.log("result is %j",result.data);
      if (result.data.ok) {
        // Encode the API token.
        var apiTokenEncoded = jwt.encode(apiToken, Meteor.settings.APIKey);
        console.log("api token is %s",apiTokenEncoded);
        return { ok: true, token: apiTokenEncoded };
      } else {
        // Failed to save the api token.
        throw new Error("error saving API token");
      }
    } else {
      // No trusted zone found.
      if (authToken.aud) {
        // The token contains the id of the zone that is requesting access.
        // This implies the resource is not private so don't throw an error.
        // The caller can use this to determine if a 'request access' can be made.
        return { ok: false };
      }
      throw new Error(authToken.iss + " does not trust " + email);
    }
  } catch (e) {
    console.log("createApiToken failed %s", e.message);
    throw new Meteor.Error("createApiToken", e.message);
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

var getJWToken = function(token) {
  try {
    if (Meteor.userId()) {
      var jt = jwt.decode(token, Meteor.settings.APIKey);
      if (jt.exp && jt.exp <= Date.now()) {
        // Token has expired.
        throw new Error("auth token expired");
      }
      if (jt.aud && jt.aud != Meteor.user().username && jt.aud != nqmTBX.helpers.getUserEmail()) {
        throw new Error("permission denied - not subject");
      }
      return {ok: true, token: jt};
    } else {
      throw new Error("permission denied - not authenticated");
    }
  } catch (e) {
    console.log("getJWToken failed: " + e.message);
    throw new Meteor.Error("getJWToken",e.message);
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
    return widgets.update({_id: new Meteor.Collection.ObjectID(widget._id)}, { $set: { position: widget.position } });
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
  "/app/share/create": function(email, scope, access, expiry) {
    this.unblock();
    return createTrustedShareToken(email, scope, access, expiry);
  },
  "/app/share/request": function(authToken) {
    this.unblock();
    return createShareTokenRequest(authToken);
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
  },
  "/app/token/lookup": function(token) {
    return getJWToken(token);
  },
  "/app/zoneConnection/create": function(params) {
    this.unblock();
    return createZoneConnection(params);
  },
  "/app/zoneConnection/accept": function(params) {
    this.unblock();
    return acceptZoneConnection(params);
  },
  "/app/zoneConnection/delete": function(id) {
    this.unblock();
    return removeZoneConnection(id);
  }
});
