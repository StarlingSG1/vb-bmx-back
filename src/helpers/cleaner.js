"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ucwords;

function ucwords(str) {
  return (str + '' || str).replace(/^([a-z])|\s+([a-z])/g, function ($1) {
    return $1.toUpperCase();
  });
}