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
const express = require('express');


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
    success_url: `http://localhost:3000/payement/success`,
    cancel_url: `http://localhost:3000/payement/canceled`,
  });
  
  return res.status(200).json({error: false, content: session});
});

const bodyParser = require('body-parser');

const endpointSecret = "whsec_eaa89ab82d1d8eae4b493078fc2c704216f8b2c9355a88891c46290032b0932e";

api.post('/webhook',  (req, response) => {
  // parse req.body to raw

  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body , sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      const session1 = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
    case 'checkout.session.async_payment_succeeded':
      const session2 = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break;
    case 'checkout.session.completed':
      const session3 = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      break;
    case 'checkout.session.expired':
      const session4 = event.data.object;
      // Then define and call a function to handle the event checkout.session.expired
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

export default api;





