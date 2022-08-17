import auth from "../../../middlewares/auth";
import { Router } from "express";
import prisma from "../../../helpers/prisma";

const api = Router();

api.get("/", async (req, res) => {
  const allProducts = await prisma.product.findMany();
  res.status(200).json(allProducts);
});

api.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      Size: true,
      Color: true,
    },
  });
  res.status(200).json(product);
});


api.post("/slug", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      slug: req.body.slug,
    },
    include: {
      Size: true,
      Color: true,
    },
  });
  res.status(200).json(product);
});


api.post("/", async (req, res) => {
  const { name, price, description, image } = req.body;
  const product = await prisma.product.create({
    data: {
      name,
      price,
      description,
      image,
    },
  });
  res.status(201).json(product);
});

api.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.delete({
    where: {
      id,
    },
  });
  res.status(200).json(product);
});

api.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image } = req.body;
  const product = await prisma.product.update({
    where: {
      id,
    },
    data: {
      name,
      price,
      description,
      image,
    },
  });
  res.status(200).json(product);
});

export default api;