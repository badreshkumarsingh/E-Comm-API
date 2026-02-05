
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
        createCounter(client.db());
    })
    .catch(err => {
        console.log(err);
    });
}

export const getdb = () => {
    return client.db();
}

const createCounter = async (db) => {
    const existingCounter = await db.collection("counters").findOne({_id: "cartItemId"});
    if(!existingCounter) {
        await db.collection("counters").insertOne({_id: "cartItemId", value: 0});
    }
}

// export default connectToMongoDB;