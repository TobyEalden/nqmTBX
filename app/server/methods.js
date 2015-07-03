/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/
Meteor.methods({
  "/app/widget/add": function(widget) {
    var widgetType = widgetTypes.findOne({ name: widget.type});
    if (widgetType) {
      console.log("adding widget of type: " + widget.type)
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
    try {
      var result = HTTP.post("http://localhost:3102/command/iot/hub/create",
          { data: { name: opts.name, description: opts.description, tags: opts.tags }});
      return result;
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }
});
