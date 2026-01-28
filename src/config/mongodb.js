
import { MongoClient } from "mongodb";

// import dotenv from 'dotenv';
// dotenv.config();

// const url = process.env.DB_URL;
// console.log("URL :"+ url);

let client;

// const connectToMongoDB = () => {
export const connectToMongoDB = () => {
    MongoClient.connect(process.env.DB_URL)
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