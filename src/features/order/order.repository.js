import { ObjectId } from 'mongodb';
import { getClient, getdb } from '../../config/mongodb.js';
import OrderModel from './order.model.js';

export default class OrderRepository {
    constructor () {
        this.collection = "orders";
    }

    async placeOrder (userId) {
        const client = getClient();
        const session = client.startSession();
        try {
            
            const db = getdb();
            session.startTransaction();

            // 1. Get cart Items and calculate totalAmount.
            const items= await this.getTotalAmount(userId, session);
            const finalTotalAmount = items.reduce((acc, item)=> acc+item.totalAmount, 0)
            console.log(finalTotalAmount);
            
            // 2. Create an order record.
            const newOrder = new OrderModel(new ObjectId(userId), finalTotalAmount, new Date());
            await db.collection(this.collection).insertOne(newOrder, {session});
            
            // 3. Reduce the stock.
            for(let item of items) {
                await db.collection("products").updateOne(
                    {_id: item.productId},
                    {$inc: {stock: -item.quantity}},
                    {session}
                )
            }
            
            // throw new Error("Something went wrong in placeOrder");

            // 4. Clear the cart items.
            await db.collection("cartItems").deleteMany(
                {userId: new ObjectId(userId)}, {session}
            )

            session.commitTransaction();
            session.endSession();
            return;
        } catch (err) {
            await session.abortTransaction;
            session.endSession;
            console.log(err);
            return res.status(200).send("Something went wrong");
        }
    }


    async getTotalAmount(userId, session) {
        const db = getdb();

        const items= await db.collection("cartItems").aggregate([
            // Stage 1: get cart items for the user
            {
                $match: {userId: new ObjectId(userId)}
            },

            // Stage 2: get the product from products collection
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            
            // Stage 3: unwind the productinfo 
            {
                $unwind: "$productInfo"
            },

            // Stage 4: Calculate total amount for each cart item
            {
                $addFields: {
                    "totalAmount": {
                        $multiply: ["$productInfo.price", "$quantity"]
                    }
                }
            }
        ], {session}).toArray();

        return items;
        
    }

} 