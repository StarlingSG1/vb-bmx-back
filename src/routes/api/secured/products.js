"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _prisma = _interopRequireDefault(require("../../../helpers/prisma"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const api = (0, _express.Router)();
api.get("/", async (req, res) => {
  const allProducts = await _prisma.default.product.findMany();
  res.status(200).json(allProducts);
});
api.get("/:id", async (req, res) => {
  const product = await _prisma.default.product.findUnique({
    where: {
      id: req.params.id
    },
    include: {
      Size: true,
      Color: true
    }
  });
  res.status(200).json(product);
});
api.post("/slug", async (req, res) => {
  const body = JSON.parse(req.body);
  const product = await _prisma.default.product.findUnique({
    where: {
      slug: body.slug
    },
    include: {
      Size: true,
      Color: true
    }
  });
  res.status(200).json(product);
});
api.post("/", async (req, res) => {
  const {
    name,
    price,
    description,
    image
  } = JSON.parse(req.body);
  const product = await _prisma.default.product.create({
    data: {
      name,
      price,
      description,
      image
    }
  });
  res.status(201).json(product);
});
api.delete("/:id", async (req, res) => {
  const {
    id
  } = req.params;
  const product = await _prisma.default.product.delete({
    where: {
      id
    }
  });
  res.status(200).json(product);
});
api.patch("/:id", async (req, res) => {
  const {
    id
  } = req.params;
  const {
    name,
    price,
    description,
    image
  } = req.body;
  const product = await _prisma.default.product.update({
    where: {
      id
    },
    data: {
      name,
      price,
      description,
      image
    }
  });
  res.status(200).json(product);
});
var _default = api;
exports.default = _default;