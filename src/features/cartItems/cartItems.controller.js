import jwt from "jsonwebtoken";
import CartItemsModel from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.repository.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class CartItemsController{

    constructor() {
        this.cartItemsRepository = new CartItemsRepository;
    }

    async add(req, res) {
        try {
            const {productId, quantity} = req.body;
            // const token = req.headers["authorization"];
            // const payload = jwt.verify(token, "QS0E7BxFK43MsuG5lhvsSk2XIWsi5JkH");
            // const userId = payload.userId;
            const userId = req.userId;

            const cartItem = await this.cartItemsRepository.add(productId, userId, quantity);
            res.status(201).send("Cart is updated");
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in Product repository", 500);
        }    
    }

    async get(req, res) {
        try {
            const userId = req.userId;
            console.log(userId);
            const userCart = await this.cartItemsRepository.get(userId);
            return res.status(200).send(userCart);
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in Product repository", 500);
        }
        
    }

    async delete(req, res) {
        const cartItemId = req.params.id;
        const userId = req.userId;
        const isDeleted = await this.cartItemsRepository.delete(cartItemId, userId);
        if(!isDeleted) {
            return res.status(404).send("Cart Item not found.");
        }
        return res.status(200).send("Cart item is removed");
    }

}