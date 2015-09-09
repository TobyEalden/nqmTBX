Package.describe({
  name: "tobyealden:nqm-tbx-globals",
  summary: "Globals for nqmTBX",
  version: "0.1.0",
  git: "https://github.com/tobyealden/meteor-nqm-tbx-globals"
});

Package.onUse(function(api) {
  api.versionsFrom("1.0.1");
  api.use(["meteor", "ddp", "jquery"]);
  
  api.addFiles("shared/index.js", ["client", "server"]);
  api.addFiles("client/index.js", ["client"]);
  api.addFiles("server/index.js", ["server"]);

  api.export("nqmTBX");
});




  
    
    
  