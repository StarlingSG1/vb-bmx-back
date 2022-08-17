import { Router } from "express";
const fetch = require("node-fetch");
const dotenv = require("dotenv");
import bcrypt from "bcryptjs";
dotenv.config();
import prisma from "../../../helpers/prisma";
import ucwords from "../../../helpers/cleaner";
import jwt from "jsonwebtoken";
import mailer from "../../../helpers/mailjet";
import verifyToken from "../../../middlewares/auth";
import auth from "../../../middlewares/auth";

const api = Router();

api.post("/register", async ({ body }, res) => {
  try {
    // Get user input
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      conditions
    } = body;

    // Validate user input
    if (!(email && password && confirmPassword && firstName && lastName && conditions)) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    if (password !== confirmPassword) {
      return res.status(400).send("Passwords does not match");
    }

    if (conditions !== true){
      return res.status(400).send("You must accept the terms and conditions");
    }
    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database

    const user = await prisma.user.create({
      data: {
        firstName: ucwords(firstName.trim().toLowerCase()),
        lastName: ucwords(lastName.trim().toLowerCase()),
        email: email.trim().toLowerCase(),
        password: encryptedPassword,
      },
    });

    // Create token
    const token = jwt.sign({ id: user.id, email }, process.env.TOKEN_SECRET, {
      expiresIn: "2h",
    });
    // save user token
    user.token = token;

    // mailer(email, firstName);
    // return new user
    return res.status(201).json({ user });
  } catch (err) {
    console.log(err);
  }
});

// LE LOGIN
api.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    console.log(user)

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({ id: user.id, email }, process.env.TOKEN_SECRET, {
        expiresIn: "2h",
      });

      // save user token
      user.token = token;
      delete user.password;

      // user
      return res.status(200).json(user);
    } else {
      return res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

api.get("/me", async (req, res) => {
  try {
    // use verifytoken
    verifyToken(req, res);
    
    
    return res.status(200).json("ok");
  } catch (err) {
    console.log(err);
  }
});

export default api;
