
import mongoose from 'mongoose';

export const likeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'types'
    },
    types: {
        type: String,
        enum: ['Product', 'Category']
    }
}).pre('save', (next) => {
    console.log("New Like coming in.");
}).post('save', (doc) => {
    console.log('Like is saved.');
    console.log(doc);
}).pre('find', (next) => {
    console.log("Retreiving Likes through Find.");
}).post('find', (docs) => {
    console.log("Find is completed.");
    console.log(docs);
})