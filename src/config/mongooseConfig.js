

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.DB_URL;
export const connectUsingMongoose = async () => {
    try{
        mongoose.connect(url)
        .then( () => {
            console.log("MongoDB using Mongoose is connected");
            }
        ).catch((err) => {
            console.log(err)
        })        
    } catch (err) {
        console.log(err);
    }
}