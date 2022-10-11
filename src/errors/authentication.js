"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WRONG_CREDENTIALS = exports.UNAUTHORIZED = exports.IN_REGISTRATION = void 0;
const UNAUTHORIZED = {
  code: 'E001',
  status: 401,
  message: 'Your not allowed to access this resource'
};
exports.UNAUTHORIZED = UNAUTHORIZED;
const WRONG_CREDENTIALS = {
  code: 'E002',
  status: 401,
  message: 'Wrong credentials'
};
exports.WRONG_CREDENTIALS = WRONG_CREDENTIALS;
const IN_REGISTRATION = {
  code: 'E003',
  status: 401,
  message: 'User registration not complete'
};
exports.IN_REGISTRATION = IN_REGISTRATION;