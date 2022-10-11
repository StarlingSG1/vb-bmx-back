"use strict";

var _passport = _interopRequireDefault(require("passport"));

var _prisma = _interopRequireDefault(require("../helpers/prisma"));

var _passportLocal = require("passport-local");

var _passportJwt = require("passport-jwt");

var _bcryptjs = require("bcryptjs");

var _authentication = require("../errors/authentication");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_passport.default.use(new _passportLocal.Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, next) => {
  const user = await _prisma.default.user.findUnique({
    where: {
      email
    },
    select: {
      password: true
    }
  });

  if (!user || !(await (0, _bcryptjs.compare)(password, user.password))) {
    return next(_authentication.WRONG_CREDENTIALS, null);
  }

  next(null, {
    email
  });
}));

_passport.default.use(new _passportJwt.Strategy({
  secretOrKey: process.env.TOKEN_SECRET,
  jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken()
}, async ({
  email
}, next) => {
  const user = await _prisma.default.user.findUnique({
    where: {
      email
    },
    select: {
      email: true
    }
  });

  if (!user) {
    return next(_authentication.WRONG_CREDENTIALS, null); // renvoie Object object au lieu de Unautorized quand il n'y a pas de user
  }

  next(null, {
    email
  });
}));