Template.createIOTHub.helpers({
  //add you helpers here
});

Template.createIOTHub.events({
  "submit #nqm-create-iot-hub-form": function(event) {
    var opts = {
      name: event.target.name.value,
      desc: event.target.description.value,
      tags: event.target.tags.value
    };

    var result = Meteor.call("/app/iothub/create", opts);

    console.log(result);
    return false;
  }
});

Template.createIOTHub.onCreated(function () {
  //add your statement here
});

Template.createIOTHub.onRendered(function () {
  //add your statement here
});

Template.createIOTHub.onDestroyed(function () {
  //add your statement here
});

