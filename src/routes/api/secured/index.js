"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _auth = _interopRequireDefault(require("./auth"));

var _welcome = _interopRequireDefault(require("./welcome"));

var _products = _interopRequireDefault(require("./products"));

var _commandes = _interopRequireDefault(require("./commandes"));

var _users = _interopRequireDefault(require("./users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const api = (0, _express.Router)();
api.use("/auth", _auth.default);
api.use("/", _welcome.default);
api.use("/products", _products.default);
api.use("/commandes", _commandes.default);
api.use("/users", _users.default);
var _default = api;
exports.default = _default;