"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _prisma = _interopRequireDefault(require("../../helpers/prisma"));

var _mailjet = _interopRequireDefault(require("../../helpers/mailjet"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fetch = require("node-fetch");

const dotenv = require("dotenv");

dotenv.config();

const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const express = require('express');

const api = (0, _express.Router)();
const endpointSecret = "whsec_koJBPZSxXPi0OfxOSAYF5W6NoKDVr3RU";

const fulfillOrder = async session => {
  const theSession = await stripe.events.retrieve(session.id);
  const payload = JSON.parse(theSession.data.object.metadata.stringBody);
  const priceInfos = await stripe.checkout.sessions.listLineItems(theSession.data.object.id);
  const dbProducts = priceInfos.data;
  const dbNumCommande = await _prisma.default.commande.findFirst({
    orderBy: {
      createdAt: "desc"
    }
  });
  let numeroCommande = "VBMX0000001";

  if (dbNumCommande) {
    const num = dbNumCommande.number.slice(4);
    const num2 = parseInt(num);
    const num3 = num2 + 1;
    const num4 = num3.toString();
    const length = num4.length;
    const toAdd = 8 - length;
    const num5 = "0".repeat(toAdd) + num4;
    const num6 = "VBMX" + num5;
    numeroCommande = num6;
  }

  const command = await _prisma.default.commande.create({
    data: {
      stripe_id: session.id,
      number: numeroCommande,
      userId: theSession.data.object.client_reference_id,
      status: "ENCOURS"
    }
  });
  payload.forEach(async (item, index) => {
    item.push(dbProducts[index].price.id);
    item[1] === null && (item[1] = "Unique");
    item[3] === null && (item[3] = "Unique");
    const product = await _prisma.default.product.findUnique({
      where: {
        stripe_id: item[5]
      }
    });
    await _prisma.default.article.create({
      data: {
        size: item[1],
        flocage: item[2],
        color: item[3],
        quantity: item[4],
        commandeId: command.id,
        productId: product.id
      }
    });
  });
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const dateCommande = day + "/" + month + "/" + year;
  const user = await _prisma.default.user.findUnique({
    where: {
      id: theSession.data.object.client_reference_id
    }
  });
  const mail = (0, _mailjet.default)(user === null || user === void 0 ? void 0 : user.email, user === null || user === void 0 ? void 0 : user.firstName, user === null || user === void 0 ? void 0 : user.lastName, dateCommande, numeroCommande);
  mail.then(result => {
    console.log(result.body);
  }).catch(err => {
    console.log(err.statusCode);
  });
};

api.post('/create-checkout-session/:id', async (req, res) => {
  let orderTable = [];
  let arrayBody = [];
  const userId = req.params.id;
  const jsonBody = JSON.parse(req.body);
  jsonBody.forEach(item => {
    orderTable.push({
      price: item.stripe,
      quantity: item.quantity
    });
  });
  jsonBody.forEach(item => {
    delete item.slug;
    delete item.image;
    delete item.description;
    delete item.stripe;
    delete item.name;
    delete item.id;
  });
  jsonBody.forEach(item => {
    const value = Object.values(item);
    arrayBody.push(value);
  });
  const stringBody = JSON.stringify(arrayBody);
  const session = await stripe.checkout.sessions.create({
    line_items: orderTable,
    mode: 'payment',
    payment_method_types: ['card'],
    metadata: {
      stringBody
    },
    client_reference_id: userId,
    allow_promotion_codes: true,
    success_url: `https://boutique.vb-bmx-club.fr/payement/success`,
    cancel_url: `https://boutique.vb-bmx-club.fr/payement/canceled`
  });
  return res.status(200).json({
    error: false,
    content: session
  });
});
api.post('/webhook', _bodyParser.default.raw({
  type: 'application/json'
}), ({
  headers,
  body
}, response) => {
  const sig = headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event;
    fulfillOrder(session);
  }

  response.send();
});
var _default = api;
exports.default = _default;