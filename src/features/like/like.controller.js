import { ApplicationError } from "../../error-handler/applicationError.js";
import { LikeRepository } from "./like.repository.js";
import mongoose from 'mongoose';

export class LikeController {
    constructor () {
        this.likeRepository = new LikeRepository();
    }

    async likeItem (req, res, next) {
        try{
            console.log("Inside 'likeItem' controller");
            const {id, type} = req.body;
            const userId= req.userId;
            if(type!='Product' && type!='Category') {
                return res.status(400).send("Invalid Type.");
            }
            if(type == 'Product') {
                console.log("Inside 'if' controller");
                console.log("userId: "+ userId + " & id: "+ id)
                this.likeRepository.likeProduct(userId, id);
                
            } else {
                this.likeRepository.likeCategory(userId, id);
            }
            return res.status(200).send("Item liked.");
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 500);
        }
    }

    async getLikes(req, res, next) {
        try {
            const {id, type} = req.query;
            const likes = await this.likeRepository.getLikes(type, id);
            return res.status(200).send(likes);
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 500);
        }
    }
}