"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _secured = _interopRequireDefault(require("./secured"));

var _order = _interopRequireDefault(require("./order"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const api = (0, _express.Router)();
api.use("/", _secured.default);
api.use("/order", _order.default);
var _default = api;
exports.default = _default;