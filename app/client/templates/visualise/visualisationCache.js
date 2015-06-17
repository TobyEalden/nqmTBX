/**
 * Created by toby on 11/06/15.
 */

visualisationCache = (function() {
  var cache = {};

  var add = function(id, vis) {
    cache[id] = vis;
  };

  var remove = function(id) {
    delete cache[id];
  };

  var find = function(lookup) {
    return cache[lookup];
  };

  var update = function(items) {
    for (var i = 0, len = items.length; i < len; i++) {
      var visInfo = find(items[i].el.data().visId);
      if (visInfo) {
        visInfo.widgetPositionChanged(items[i].x,items[i].y,items[i].width,items[i].height);
      } else {
        console.log("!!!! unknown item in visualisation cache update");
      }
    }
  };

  return {
    add: add,
    remove: remove,
    find: find,
    update: update
  }
}());