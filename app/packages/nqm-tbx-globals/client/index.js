nqmTBX.ui = {};

nqmTBX.ui.notification = function(msg, delay) {
  delay = delay || 2000;
  return Materialize.toast(msg,delay);
};