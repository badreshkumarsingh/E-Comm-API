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

}

export default ProductRepository;