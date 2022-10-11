"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.launch = launch;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _passport = _interopRequireDefault(require("passport"));

var _routes = _interopRequireDefault(require("./routes"));

var _injectResponseHelpers = _interopRequireDefault(require("./middlewares/inject-response-helpers"));

require("./middlewares/passport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PORT = process.env.PORT || 8080;

function launch(port) {
  /* Initialize */
  // Express Application
  const application = (0, _express.default)();
  /* Middlewares */

  application.use((0, _injectResponseHelpers.default)());
  application.use(_express.default.raw({
    type: "*/*"
  }));
  application.use(_express.default.json());
  application.use(_express.default.static('uploads'));
  application.use(_express.default.urlencoded({
    extended: true
  }));
  application.use((0, _cors.default)({
    origin: '*'
  }));
  application.use(_passport.default.initialize());
  application.use(function (error, req, res, next) {
    console.log('Err:', error);
    next();
  });
  /* Routes */

  application.use('/', _routes.default);
  application.listen(PORT, () => {
    console.log(`Server started at: http://localhost:${port}`);
  });
}