import dotenv from "dotenv";
dotenv.config();

const mailjet = require("node-mailjet").connect(
  process.env.MAILJET_1,
  process.env.MAILJET_2
);

export default function mailer(email,firstname,lastname,order_date,order_id) {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "contact@vb-bmx-club.fr",
          Name: "VB BMX CLUB",
        },
        To: [
          {
            Email: email,
            Name: firstname + " " + lastname,
          },
        ],
        TemplateID: 4269222,
        TemplateLanguage: true,
        Subject: "Confirmation de votre commande",
        Variables: {
          firstname: firstname,
          order_date: order_date,
          order_id: order_id,
        },
      },
    ],
  });
  return request;
}
