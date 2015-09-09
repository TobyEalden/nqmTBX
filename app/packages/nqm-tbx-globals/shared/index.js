if (!nqmTBX) {
  nqmTBX = {};
}

if (!nqmTBX.helpers) {
  nqmTBX.helpers = {};
}

nqmTBX.helpers.isEmailValid = function(address) {
  // TODO - improve this (use mailgun?)
  return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(address);
};

