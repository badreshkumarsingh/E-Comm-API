
import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017/ecomdb";

let client;

// const connectToMongoDB = () => {
export const connectToMongoDB = () => {
    MongoClient.connect(url)
    // .then(client => {
    .then(clientInstance => {
        client = clientInstance;
        console.log("MongoDB is connected");
    })
    .catch(err => {
        console.log(err);
    });
}

export const getdb = () => {
    return client.db();
}

// export default connectToMongoDB;