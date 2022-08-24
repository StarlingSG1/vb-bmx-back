import auth from "../../../middlewares/auth";
import { Router } from "express";
import prisma from "../../../helpers/prisma";

const api = Router();

// get all commandes
api.get("/", async (req, res) => {
    const allCommandes = await prisma.commande.findMany();
    res.status(200).json(allCommandes);
}
);

// get all commande for user Id
api.get("/:id", async (req, res) => {
    const commandes = await prisma.commande.findMany({
        where: {
            userId: req.params.id,
        },
        include: {
            user: true,
            Article: true,
        },
    });
    res.status(200).json(commandes);
} 
);

// patch a commande
api.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const commande = await prisma.commande.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });
    res.status(200).json(commande);
}
);

export default api;
