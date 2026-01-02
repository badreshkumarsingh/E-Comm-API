import { getdb } from "../../config/mongodb.js";

class UserRepository {
    async signUp(newUser) {
        try {
            // get db
            const db = getdb();

            // get collction
            const collection = db.collection("users");

            // insert document
            await collection.insertOne(newUser);
            return newUser;
        } catch (err) {
            throw new ApplicationError("Something went wrong in signUp repository", 500);
        }
    }
}

export default UserRepository;