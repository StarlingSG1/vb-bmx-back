import { Router } from "express";
const fetch = require("node-fetch");
const dotenv = require("dotenv");
import bcrypt from "bcryptjs";
dotenv.config();
import prisma from "../../../helpers/prisma";
import ucwords from "../../../helpers/cleaner";
import jwt from "jsonwebtoken";


const api = Router();

api.post("/update", async ({ body }, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      token
    } = JSON.parse(body);
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    // Validate user input
    if (!(email && firstName && lastName )) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    if(decoded.email !== email){
      const oldUser = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      })
      if (oldUser) {
        return res.status(409).send("Veillez renseigner un autre email");
      }
    }

    const id = decoded.id;

    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        firstName: ucwords(firstName),
        lastName: ucwords(lastName),
        email: email.toLowerCase(),
        phone: phone,
      },
    });

    // Create token
    const newToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "2h",
      }
    );

    return res.status(201).json({ user, newToken });
  } catch (err) {
    console.log(err);
  }
});

api.post("/update-password", async ({ body }, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword, token } = body;
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    // Validate user input
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      if (newPassword !== confirmPassword) {
        return res.status(400).send("Les mots de passe ne correspondent pas");
      }
      const encryptedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: {
          id: decoded.id,
        },
        data: {
          password: encryptedPassword,
        },
      });
    }
    // Create token
    const newToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "2h",
      }
    );

    return res.status(201).json({ newToken });
  } catch (err) {
    console.log(err);
  }
});

export default api;
