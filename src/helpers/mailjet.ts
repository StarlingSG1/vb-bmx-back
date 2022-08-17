import dotenv from "dotenv";
dotenv.config();
const mailjet = require("node-mailjet").connect(
  process.env.MAILJET_1,
  process.env.MAILJET_2
);

export default function mailer(email, name) {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "barriere.jeremie@gmail.com",
          Name: "Biscotte Family",
        },
        To: [
          {
            Email: email,
            Name: name,
          },
        ],
        TemplateID: 4007808,
        TemplateLanguage: true,
        Subject: "Création de votre compte BISCOTTE FAMILY",
        Variables: {
          name: name,
        },
      },
    ],
  });
  return request;
}
