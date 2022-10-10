import dotenv from "dotenv";
dotenv.config();

const mailjet = require("node-mailjet").connect(
  process.env.MAILJET_1,
  process.env.MAILJET_2
);

export default function mailer() {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    "Messages": [
      {
        "From": {
          "Email": "contact@vb-bmx-club.fr",
          "Name": "VB BMX CLUB",
        },
        "To": [
          {
            "Email": "contact@vb-bmx-club.fr",
            "Name": "Test",
          },
        ],
        "Subject": "Confirmation de votre commande. NUMERO DE COMMANDE : VB-XXXX",
        "TextPart": "My first Mailjet email",
        "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      },
    ],
  });
  return request;
}
