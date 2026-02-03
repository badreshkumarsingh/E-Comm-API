import express from "express";
import CartItemsController from "./cartItems.controller.js";

const cartRouter = express.Router();
const cartItemsController = new CartItemsController;

cartRouter.delete('/:id', (req, res) => {
    cartItemsController.delete(req, res);
});
cartRouter.post('/', (req, res) => {
    cartItemsController.add(req, res);
});
cartRouter.get('/', (req, res) => {
    cartItemsController.get(req, res);
});

export default cartRouter;