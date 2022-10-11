"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mailer;

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const mailjet = require("node-mailjet").connect(process.env.MAILJET_1, process.env.MAILJET_2);

function mailer(email, firstname, lastname, order_date, order_id) {
  const request = mailjet.post("send", {
    version: "v3.1"
  }).request({
    Messages: [{
      From: {
        Email: "contact@vb-bmx-club.fr",
        Name: "VB BMX CLUB"
      },
      To: [{
        Email: email,
        Name: firstname + " " + lastname
      }],
      TemplateID: 4269222,
      TemplateLanguage: true,
      Subject: "Confirmation de votre commande",
      Variables: {
        firstname: firstname,
        order_date: order_date,
        order_id: order_id
      }
    }]
  });
  return request;
}