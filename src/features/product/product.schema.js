

import mongoose from 'mongoose';

export const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    Category: String,
    description: String,
    inStock: Number
})