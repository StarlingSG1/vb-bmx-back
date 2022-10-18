import verifyToken from "../../../middlewares/auth";
import { Router } from "express";
import prisma from "../../../helpers/prisma";
import { mailerCommandStatus } from "../../../helpers/mailjet";

const api = Router();

// get all commandes
api.get("/", async (req, res) => {
    const allCommandes = await prisma.commande.findMany({
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                },
            },  
            Article: {
                include: {
                    Product: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
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
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                },
            },  
            Article: {
                include: {
                    Product: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    res.status(200).json(commandes);
} 
);

// patch a commande
api.patch("/:id", async (req, res) => {
    
    const { id } = req.params;
    const body = JSON.parse(req.body);
    const { status } = body;

    const commande = await prisma.commande.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });

    const user = await prisma.user.findUnique({
        where: {
            id: commande.userId,
        },
    });


    if(commande.status === "RECUPERATION") {
        mailerCommandStatus(user.email, user.firstName, user.lastName, commande.number);
    }

    res.status(200).json(commande.status);
}
);

export default api;
