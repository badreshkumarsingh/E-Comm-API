import express from "express";
import CartItemsController from "./cartItems.controller.js";

const cartRouter = express.Router();
const cartItemsController = new CartItemsController;

cartRouter.delete('/:id', cartItemsController.delete);
cartRouter.post('/', cartItemsController.add);
cartRouter.get('/', cartItemsController.get);

export default cartRouter;