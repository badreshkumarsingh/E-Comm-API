import { ObjectId } from 'mongodb';
import { getdb } from '../../config/mongodb.js';
import { ApplicationError } from '../../error-handler/applicationError.js';
import { productSchema } from './product.schema.js';
import { reviewSchema } from './review.schema.js';
import mongoose from 'mongoose';
import { categorySchema } from './category.schema.js';

const ProductModel = mongoose.model('Product', productSchema);
const ReviewModel = mongoose.model('Review', reviewSchema);
const CategoryModel = mongoose.model('Category', categorySchema);



class ProductRepository {

    constructor () {
        this.collection = 'products';
    }

    async add(productData) {
        try {
            // const db = getdb();
            // const collection = db.collection(this.collection);

            // await collection.insertOne(newProduct);
            // return newProduct;

            // 1. Add product
            
            productData.categories = productData.category.split(',').map(e=> e.trim());
            console.log(productData);
            const newProduct = ProductModel(productData);
            const savedProduct = await newProduct.save();

            // 2. Update Categories
            await CategoryModel.updateMany(
                {_id: {$in: productData.categories}},
                {
                    $push: {products: new ObjectId(savedProduct._id)}
                }
            );

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

    // async rate(userId, productId, rating) {
    //     try {
    //         const db = getdb();
    //         const collection = db.collection(this.collection);
            
    //         // 1. Remove existing entry
    //         await collection.updateOne({
    //             _id: new ObjectId(productId)
    //         }, {
    //             $pull: {ratings: {userId: new ObjectId(userId)}}
    //         });
            
    //         // 2. Add new entry
    //         await collection.updateOne({_id: new ObjectId(productId)},
    //             { $push: { ratings: { userId: new ObjectId(userId), rating: rating } } });

    //         // console.log("userId in repo: ", userId);
    //     } catch (err) {
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong in Product repository", 500);
    //     }
    // }

    async rate(userId, productId, rating) {
        try {
            // 1. Check if product exists
            const productToUpdate = await ProductModel.findById(productId);
            if(!productToUpdate) {
                throw new Error("Product not found.");
            }

            // 2. Get the existing review
            const userReview = await ReviewModel.findOne({product: new ObjectId(productId),
                user: new ObjectId(userId)
            });
            if(userReview) {
                userReview.rating = rating;
                await userReview.save();
            } else {
                const newReview = new ReviewModel({
                    product: new ObjectId(productId),
                    user: new ObjectId(userId),
                    rating: rating
                });
                newReview.save();
            }

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