"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function validateObject(object, fields) {
  const {
    mandatory,
    optional = []
  } = fields; // ~ Verify mandatory fields

  const missingFields = mandatory.filter(field => {
    return !object.hasOwnProperty(field);
  });

  if (missingFields.length > 0) {
    return {
      missingFields,
      object: null
    };
  } // ~ Remove keys witch doesn't belong to mandatory or optional keys


  return {
    missingFields: [],
    object: Object.keys(object).filter(key => mandatory.includes(key) || optional.includes(key)).reduce((accumulator, key) => {
      return { ...accumulator,
        [key]: object[key]
      };
    }, {})
  };
}

var _default = validateObject;
exports.default = _default;