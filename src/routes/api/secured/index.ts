import { Router } from "express";

import auth  from "./auth";
import welcome  from "./welcome";
import products from "./products";
import commandes from "./commandes";
import users from "./users";

const api = Router();

api.use("/auth", auth);
api.use("/", welcome);
api.use("/products", products);
api.use("/commandes", commandes);
api.use("/users", users);

export default api;
