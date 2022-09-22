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
  const myBody2 = JSON.stringify(myBody)
  myBody.forEach(item => {
    orderTable.push({price: item.stripe, quantity: item.quantity})
  });
  const session = await stripe.checkout.sessions.create({
    line_items: orderTable,
    mode: 'payment',  
    payment_method_types: ['card'],
    metadata: {
     myBody2
    },
    client_reference_id: "da285cd7-4d6c-444d-b39e-c220c8ff4bda",

    allow_promotion_codes: true,
    success_url: `http://localhost:3000/payement/success`,
    cancel_url: `http://localhost:3000/payement/canceled`,
  });
  
  return res.status(200).json({error: false, content: session});
});


const endpointSecret = "whsec_XSb8D6vsHsC7VJ7NKBILxmc0eOWwVob1";

const fulfillOrder = async (session,response) => {
  // TODO: fill me in
  const session4 = await stripe.events.retrieve(session.id)
  console.log(session4)
  const command = await prisma.commande.create({
    data: {
      stripe_id: session.id,
      number: "VBMX00000001",
      userId: session4.data.object.client_reference_id,
      status: "ENCOURS",
    }
  })
  console.log(command)





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
    const session = event;
    // Fulfill the purchase...
    fulfillOrder(session, response);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

export default api;





