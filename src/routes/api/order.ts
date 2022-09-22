import { Router, raw } from "express";
const fetch = require("node-fetch");
const dotenv = require("dotenv");
import bcrypt from "bcryptjs";
dotenv.config();
import prisma from "../../helpers/prisma";
import ucwords from "../../helpers/cleaner";
import jwt from "jsonwebtoken";
import mailer from "../../helpers/mailjet";
import verifyToken from "../../middlewares/auth";
import auth from "../../middlewares/auth";
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const express = require('express');
import bodyParser from "body-parser";


const api = Router();

api.post('/create-checkout-session',  async (req, res) => {
  let orderTable = [];
  const myBody = JSON.parse(req.body)
  myBody.forEach(item => {
    orderTable.push({price: item.stripe, quantity: item.quantity})
  });
  const session = await stripe.checkout.sessions.create({
    line_items: orderTable,
    metadata: {"test": "test"},
    mode: 'payment',  
    payment_method_types: ['card'],
    allow_promotion_codes: true,
    success_url: `http://localhost:3000/payement/success`,
    cancel_url: `http://localhost:3000/payement/canceled`,
  });
  
  return res.status(200).json({error: false, content: session});
});


const endpointSecret = "whsec_kfRBxSFqlMXaiy0VL4wuOUURbOKT2gam";

const fulfillOrder = async (session) => {
  // TODO: fill me in

  const session4 = await stripe.events.retrieve("evt_1Lkl5lGaJHiI9Jq6BPnRtu7R")
  console.log("eevnt", session4)



}


  api.post('/webhook', bodyParser.raw({type: 'application/json'}), ({headers, body}, response) => {
    
  // parse req.body to raw
  const sig = headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(body , sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Fulfill the purchase...
    fulfillOrder(session);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

export default api;





