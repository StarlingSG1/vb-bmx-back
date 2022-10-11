"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _client = require("@prisma/client");

const prisma = global.prisma || new _client.PrismaClient();
global.prisma = prisma;
var _default = prisma;
exports.default = _default;