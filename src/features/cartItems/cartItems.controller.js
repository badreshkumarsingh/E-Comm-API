import jwt from "jsonwebtoken";
import CartItemsModel from "./cartItems.model.js";

export default class CartItemsController{
    add(req, res) {
        const {productId, quantity} = req.query;
        // const token = req.headers["authorization"];
        // const payload = jwt.verify(token, "QS0E7BxFK43MsuG5lhvsSk2XIWsi5JkH");
        // const userId = payload.userId;
        const userId = req.userId;

        const cartItem = CartItemsModel.add(productId, userId, quantity);
        return res.status(201).send("Cart is updated");
    }

    get(req, res) {
        const userId = req.userId;
        console.log(userId);
        const userCart = CartItemsModel.get(userId);
            return res.status(200).send(userCart);
    }

    delete(req, res) {
        const cartItemId = req.params.id;
        const userId = req.userId;
        const error = CartItemsModel.delete(cartItemId, userId);
        if(error) {
            return res.status(404).send(error);
        }
        return res.status(200).send("Cart item is removed");
    }

}