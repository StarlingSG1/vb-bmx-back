"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNKNOWN_RESOURCE = exports.MISSING_FIELDS = exports.BAD_REQUEST = void 0;

const MISSING_FIELDS = fields => ({
  code: 'E010',
  status: 400,
  message: `Missing mandatory fields: ${fields.join(', ')}`
});

exports.MISSING_FIELDS = MISSING_FIELDS;

const UNKNOWN_RESOURCE = (name, field) => ({
  code: 'E011',
  status: 400,
  message: `Unknown ${name} with ${field.name}:${field.value}`
});

exports.UNKNOWN_RESOURCE = UNKNOWN_RESOURCE;

const BAD_REQUEST = message => ({
  code: 'E012',
  status: 400,
  message
});

exports.BAD_REQUEST = BAD_REQUEST;