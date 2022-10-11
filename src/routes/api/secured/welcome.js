"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _auth = _interopRequireDefault(require("../../../middlewares/auth"));

var _express = require("express");

var _prisma = _interopRequireDefault(require("../../../helpers/prisma"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const api = (0, _express.Router)();
api.get("/welcome", _auth.default, async (req, res) => {
  const userValue = {
    id: req.user.id,
    email: req.user.email
  };
  const user = await _prisma.default.account.findMany({
    where: {
      userId: userValue.id
    }
  });
  res.status(200).json(user);
});
var _default = api;
exports.default = _default;