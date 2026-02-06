import { ObjectId } from 'mongodb';
import { getdb } from '../../config/mongodb.js';
import { ApplicationError } from '../../error-handler/applicationError.js';
class ProductRepository {

    constructor () {
        this.collection = 'products';
    }

    async add(newProduct) {
        try {
            const db = getdb();
            const collection = db.collection(this.collection);

            await collection.insertOne(newProduct);
            return newProduct;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in Product repository", 500);
        }
    }

    async getAll() {
        try {
            const db = getdb();
            const collection = db.collection(this.collection);

            return await collection.find().toArray();
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in Product repository", 500);
        }
    }

    async get(id) {
        try {
            const db = getdb();
            const collection = db.collection(this.collection);

            return await collection.findOne({_id: new ObjectId(id)});
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in Product repository", 500);
        }
    }

    async filter(minPrice, category) {
        try {
            const db = getdb();
            const collection = db.collection(this.collection);
            let filterExpression = {};
            if(minPrice) {
                filterExpression.price = { $gte: parseFloat(minPrice)};
            }
            // if(maxPrice) {
            //     filterExpression.price = { ...filterExpression.price, $lte: parseFloat(maxPrice)};
            // }
            if(category) {
                // filterExpression = { $and: [{category: category}, filterExpression]};
                filterExpression = { $or: [{category: category}, filterExpression]};
                // filterExpression.category = category;
            }
            return await collection.find(filterExpression).project({name:1, price:1, _id: 0, ratings: {$slice: -1}}).toArray();

        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in Product repository", 500);
        }
    }


    // async rate(userId, productId, rating) {
    //     try {
    //         const db = getdb();
    //         const collection = db.collection(this.collection);
    //         // 1. Find the Product
    //         const product = await collection.findOne({_id: new ObjectId(productId)});
    //         // 2. Find the rating object for given userId
    //         const userRating = product?.ratings?.find((r) => r.userId == userId);
    //         if(userRating) {
    //             // 3. Update the rating
    //             await collection.updateOne({
    //                 _id: new ObjectId(productId), "ratings.userId": new ObjectId(userId)
    //             }, {
    //                 $set: {"ratings.$.rating": rating}
    //             });
    //         } else {
    //             await collection.updateOne({_id: new ObjectId(productId)},
    //             { $push: { ratings: { userId: new ObjectId(userId), rating: rating } } });
    //         }
    //         // console.log("userId in repo: ", userId);
    //     } catch (err) {
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong in Product repository", 500);
    //     }
    // }

    async rate(userId, productId, rating) {
        try {
            const db = getdb();
            const collection = db.collection(this.collection);
            
            // 1. Remove existing entry
            await collection.updateOne({
                _id: new ObjectId(productId)
            }, {
                $pull: {ratings: {userId: new ObjectId(userId)}}
            });
            
            // 2. Add new entry
            await collection.updateOne({_id: new ObjectId(productId)},
                { $push: { ratings: { userId: new ObjectId(userId), rating: rating } } });

            // console.log("userId in repo: ", userId);
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in Product repository", 500);
        }
    }


    async averageProductPricePerCategory() {
        try{
            const db = getdb();
            return await db.collection(this.collection).aggregate([
                {
                    $group: {
                        _id: "$category",
                        averagePrice: {$avg: "$price"}
                    }
                }
            ]).toArray();

        }catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong in Product repository", 500);
        }
    }

}

export default ProductRepository;