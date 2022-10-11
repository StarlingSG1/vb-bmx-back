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
api.post("/register", async ({
  body
}, res) => {
  try {
    // Get user input
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      conditions
    } = JSON.parse(body); // Validate user input

    if (!(email && password && confirmPassword && firstName && lastName && conditions)) {
      return res.status(400).send("All input is required");
    } // check if user already exist
    // Validate if user exist in our database


    const oldUser = await _prisma.default.user.findUnique({
      where: {
        email: email.toLowerCase()
      }
    });

    if (oldUser) {
      return res.status(200).json({
        error: true,
        message: "Un utilisateur avec cet email existe déjà"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).send("Passwords does not match");
    }

    if (conditions !== true) {
      return res.status(400).send("You must accept the terms and conditions");
    } //Encrypt user password


    const encryptedPassword = await _bcryptjs.default.hash(password, 10); // Create user in our database

    const user = await _prisma.default.user.create({
      data: {
        firstName: (0, _cleaner.default)(firstName.trim().toLowerCase()),
        lastName: (0, _cleaner.default)(lastName.trim().toLowerCase()),
        email: email.trim().toLowerCase(),
        password: encryptedPassword,
        phone: phone,
        role: "USER"
      }
    }); // Create token

    const token = _jsonwebtoken.default.sign({
      id: user.id,
      email
    }, process.env.TOKEN_SECRET, {
      expiresIn: "2h"
    }); // save user token


    user.token = token; // mailer(email, firstName);
    // return new user

    return res.status(201).json({
      user
    });
  } catch (err) {
    console.log(err);
  }
}); // LE LOGIN

api.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    const VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${req.body['recaptcha']}`;
    const tokenValue = fetch(VERIFY_URL, {
      method: 'POST'
    }); // Get user input

    const {
      email,
      password
    } = JSON.parse(req.body); // Validate user input

    if (!(email && password)) {
      return res.status(200).json({
        error: true,
        message: "Tout les champs doivent être rempli"
      });
    } // Validate if user exist in our database


    const user = await _prisma.default.user.findUnique({
      where: {
        email: email
      }
    });

    if (!user) {
      return res.status(200).json({
        error: true,
        message: "Adresse email ou mot de passe incorrect"
      });
    }

    if (user && (await _bcryptjs.default.compare(password, user.password))) {
      // Create token
      const token = _jsonwebtoken.default.sign({
        id: user.id,
        email
      }, process.env.TOKEN_SECRET, {
        expiresIn: "2h"
      }); // save user token


      user.token = token;
      delete user.password; // user

      return res.status(200).json(user);
    } else {
      return res.status(200).json({
        error: true,
        message: "Adresse email ou mot de passe incorrect"
      });
    }
  } catch (err) {
    console.log(err);
  }
});
api.post("/me", async ({
  body
}, res) => {
  const myBody = JSON.parse(body);

  try {
    const decoded = _jsonwebtoken.default.verify(myBody.token, process.env.TOKEN_SECRET);

    const user = await _prisma.default.user.findUnique({
      where: {
        id: decoded.id
      }
    });
    delete user.password;
    res.status(200).send({
      user: user
    });
  } catch (err) {
    res.status(400).send({
      error: "AUTHFAILED"
    });
  }
});
var _default = api;
exports.default = _default;