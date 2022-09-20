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
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


const api = Router();

api.post('/create-checkout-session', async (req, res) => {
  console.log(req.body);
  let orderTable = [];
  req.body.forEach(item => {
    orderTable.push({price: item.stripe, quantity: item.quantity})
  });
  console.log(orderTable);

  const session = await stripe.checkout.sessions.create({
    line_items: orderTable,
    mode: 'payment',
    payment_method_types: ['card'],
    allow_promotion_codes: true,
    success_url: `${process.env.LOCAL_FRONT_URL}?success=true`,
    cancel_url: `${process.env.LOCAL_FRONT_URL}?canceled=true`,
  });
  
  return res.status(200).json({error: false, content: session});
});

export default api;





