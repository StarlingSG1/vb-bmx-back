import { Router } from "express";

import secured from "./secured";

const api = Router();
import order from "./order";


api.use("/", secured);
api.use("/order", order);



export default api;
