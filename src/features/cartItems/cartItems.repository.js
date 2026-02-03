import { ObjectId } from 'mongodb';
import {getdb} from '../../config/mongodb.js';
import { ApplicationError } from '../../error-handler/applicationError.js';

export default class CartItemsRepository {

    constructor() {
        this.collection = "cartItems";
    }

    async add(productId, userId, quantity) {
        try {
            const db = getdb();
            const collection = db.collection(this.collection);
            await collection.insertOne({productId: new ObjectId(productId), userId: new ObjectId(userId), quantity});
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in Product repository", 500);
        }
    }

    async get(userId) {
        try {
            const db = getdb();
            const collection = db.collection(this.collection);

            const cartItems = await collection.find({userId: new ObjectId(userId)}).toArray();
            return cartItems;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in Product repository", 500);
        }
    }

    async delete(cartItemId, userId) {
        try {
            const db = getdb();
            const collection = db.collection(this.collection);

            const result = await collection.deleteOne({_id: new ObjectId(cartItemId), userId: new ObjectId(userId)});
            return result.deletedCount>0 ;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in Product repository", 500);
        }
    }
}