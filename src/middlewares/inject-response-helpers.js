"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = () => {
  return (_, response, next) => {
    response.error = function (error) {
      if (!Array.isArray(error)) {
        this.status(error.status).json({
          error: {
            code: error.code,
            message: error.message
          }
        });
        return;
      }

      this.status(error[0].status || 400).json({
        errors: error
      });
    };

    response.success = function ({
      status,
      payload
    }) {
      if (!payload) {
        return this.status(status).end();
      }

      this.status(status).json({
        data: payload
      });
    };

    next();
  };
};

exports.default = _default;