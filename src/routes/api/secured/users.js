"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _prisma = _interopRequireDefault(require("../../../helpers/prisma"));

var _cleaner = _interopRequireDefault(require("../../../helpers/cleaner"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fetch = require("node-fetch");

const dotenv = require("dotenv");

dotenv.config();
const api = (0, _express.Router)();
api.post("/update", async ({
  body
}, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      token
    } = JSON.parse(body);

    const decoded = _jsonwebtoken.default.verify(token, process.env.TOKEN_SECRET); // Validate user input


    if (!(email && firstName && lastName)) {
      return res.status(400).send("All input is required");
    } // check if user already exist
    // Validate if user exist in our database


    if (decoded.email !== email) {
      const oldUser = await _prisma.default.user.findUnique({
        where: {
          email: email.toLowerCase()
        }
      });

      if (oldUser) {
        return res.status(409).send("Veillez renseigner un autre email");
      }
    }

    const id = decoded.id;
    const user = await _prisma.default.user.update({
      where: {
        id: id
      },
      data: {
        firstName: (0, _cleaner.default)(firstName),
        lastName: (0, _cleaner.default)(lastName),
        email: email.toLowerCase(),
        phone: phone
      }
    }); // Create token

    const newToken = _jsonwebtoken.default.sign({
      id: user.id,
      email: user.email
    }, process.env.TOKEN_SECRET, {
      expiresIn: "2h"
    });

    return res.status(201).json({
      user,
      newToken
    });
  } catch (err) {
    console.log(err);
  }
});
api.post("/update-password", async ({
  body
}, res) => {
  try {
    const {
      oldPassword,
      newPassword,
      confirmPassword,
      token
    } = body;

    const decoded = _jsonwebtoken.default.verify(token, process.env.TOKEN_SECRET); // Validate user input


    const user = await _prisma.default.user.findUnique({
      where: {
        id: decoded.id
      }
    });

    if (user && (await _bcryptjs.default.compare(oldPassword, user.password))) {
      if (newPassword !== confirmPassword) {
        return res.status(400).send("Les mots de passe ne correspondent pas");
      }

      const encryptedPassword = await _bcryptjs.default.hash(newPassword, 10);
      await _prisma.default.user.update({
        where: {
          id: decoded.id
        },
        data: {
          password: encryptedPassword
        }
      });
    } // Create token


    const newToken = _jsonwebtoken.default.sign({
      id: user.id,
      email: user.email
    }, process.env.TOKEN_SECRET, {
      expiresIn: "2h"
    });

    return res.status(201).json({
      newToken
    });
  } catch (err) {
    console.log(err);
  }
});
var _default = api;
exports.default = _default;