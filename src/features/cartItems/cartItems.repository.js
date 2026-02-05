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
            const id = await this.getNextCounter(db);
            await collection.updateOne(
                {productId: new ObjectId(productId), userId: new ObjectId(userId)},
                {$setOnInsert: {_id: id},
                    $inc: {quantity: quantity}},
                {upsert: true}
            );
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in Cart repository", 500);
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

    async getNextCounter(db) {
        const resultDocument = await db.collection("counters").findOneAndUpdate(
            {_id: "cartItemId"},
            {$inc: {value: 1}},
            {returnDocument: "after"}
        );
        console.log(resultDocument);
        console.log("resultDocument.value: "+resultDocument.value)
        return resultDocument.value;
    }
}