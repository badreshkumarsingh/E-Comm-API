import { getdb } from "../../config/mongodb.js";

class UserRepository {

    constructor () {
        this.collection = 'users';
    }

    async signUp(newUser) {
        try {
            // get db
            const db = getdb();

            // get collction
            const collection = db.collection(this.collection);

            // insert document
            await collection.insertOne(newUser);
            return newUser;
        } catch (err) {
            throw new ApplicationError("Something went wrong in signUp repository", 500);
        }
    }

    async signIn(email, password) {
        try {
            // get db
            const db = getdb();

            // get collction
            const collection = db.collection(this.collection);

            // find the document
            return await collection.findOne({ email, password });
        } catch (err) {
            throw new ApplicationError("Something went wrong in signIn repository", 500);
        }
    }

    async findByEmail(email) {
        try {
            // get db
            const db = getdb();

            // get collction
            const collection = db.collection("users");

            // find the document
            return await collection.findOne({ email});
        } catch (err) {
            throw new ApplicationError("Something went wrong in signIn repository", 500);
        }
    }
}

export default UserRepository;