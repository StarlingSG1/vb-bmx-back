"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _prisma = _interopRequireDefault(require("../../../helpers/prisma"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const api = (0, _express.Router)(); // get all commandes

api.get("/", async (req, res) => {
  const allCommandes = await _prisma.default.commande.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true
        }
      },
      Article: {
        include: {
          Product: true
        }
      }
    }
  });
  res.status(200).json(allCommandes);
}); // get all commande for user Id

api.get("/:id", async (req, res) => {
  const commandes = await _prisma.default.commande.findMany({
    where: {
      userId: req.params.id
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true
        }
      },
      Article: {
        include: {
          Product: true
        }
      }
    }
  });
  res.status(200).json(commandes);
}); // patch a commande

api.patch("/:id", async (req, res) => {
  const {
    id
  } = req.params;
  const {
    status
  } = req.body;
  const commande = await _prisma.default.commande.update({
    where: {
      id
    },
    data: {
      status
    }
  }); // Pouvoir envoyer un mail si la commande est RECUPERABLE 

  res.status(200).json(commande.status);
});
var _default = api;
exports.default = _default;