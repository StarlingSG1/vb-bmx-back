import auth from "../../../middlewares/auth";
import { Router } from "express";
import prisma from "../../../helpers/prisma";

const api = Router();

api.get("/welcome", auth, async (req, res) => {
  const userValue = { id: req.user.id, email: req.user.email };

  const user = await prisma.account.findMany({
    where: {
      userId: userValue.id,
    },
  });
  res.status(200).json(user);
});

export default api;
