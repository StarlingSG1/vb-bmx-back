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
const endpointSecret = "whsec_XSb8D6vsHsC7VJ7NKBILxmc0eOWwVob1";

const fulfillOrder = async (session,response) => {
  const theSession = await stripe.events.retrieve(session.id)
  console.log(theSession)
  const command = await prisma.commande.create({
    data: {
      stripe_id: session.id,
      number: "VBMX00000002",
      userId: theSession.data.object.client_reference_id,
      status: "ENCOURS",
    }
  })

  const payload = JSON.parse(theSession.data.object.metadata.myBody2)
  payload.forEach(async item => {
    item.size === null && (item.size = "Unique")
    await prisma.article.create({
      data: {
        size: item.size,
        flocage: item.flocage,
        quantity: item.quantity,
        commandeId: command.id,
        productId: item.id,
      }
    })
    
  })
}



api.post('/create-checkout-session',  async (req, res) => {
  let orderTable = [];
  
  const myBody = JSON.parse(req.body)
  myBody.forEach(item => {
    orderTable.push({price: item.stripe, quantity: item.quantity})
  });

  myBody.forEach(item => {
    delete item.slug;
    delete item.image;
    delete item.description;
    delete item.stripe;
    delete item.name;
    delete item.id;
    console.log(item["price"])

  })

    console.log(myBody)
    const myBody2 = JSON.stringify(myBody)
    console.log(myBody2)
  const session = await stripe.checkout.sessions.create({
    line_items: orderTable,
    mode: 'payment',  
    payment_method_types: ['card'],
    metadata: {
     myBody2
    },
    client_reference_id: "848f9b9a-90aa-4e29-bf2e-d9991e6f48a9",

    allow_promotion_codes: true,
    success_url: `http://localhost:3000/payement/success`,
    cancel_url: `http://localhost:3000/payement/canceled`,
  });
  
  return res.status(200).json({error: false, content: session});
});




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





