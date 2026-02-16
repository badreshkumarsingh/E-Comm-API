import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import { ApplicationError } from "../../error-handler/applicationError.js";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";


export default class UserController {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async signUp(req, res, next) {
        try {
            const {name, email, password, type} = req.body;

            const hashedPassword = await bcrypt.hash(password, 12);

            // const newUser = new UserModel(name, email, password, type);
            const newUser = new UserModel(name, email, hashedPassword, type);

            await this.userRepository.signUp(newUser);
            res.status(201).send({name: newUser.name, email:newUser.email, type: newUser.type, _id: newUser._id});
        } catch (err) {
            next(err);
            // return res.status(200).send("Something went wrong");
        }
        // res.status(201).send(newUser);
    }

    // signIn(req, res) {
    async signIn(req, res, next) {

        // const result = UserModel.signIn(req.body.email, req.body.password);
        try {
            // 1 Find User by EMail
            const user = await this.userRepository.findByEmail(req.body.email);

            if(!user) {
                return res.status(400).send('Invalid Credentials');
            } else {
                // 2. Compare password with hashed password.
                const result = await bcrypt.compare(req.body.password, user.password);
                if(result) {
                    
                    // 3. Create token
                    // const token = jwt.sign({userId: result.id, email: result.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
                    const token = jwt.sign({userId: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});


                    // 4. Send token
                    return res.status(200).send(token);
                } else {
                    return res.status(400).send('Invalid Credentials');
                }
            }

            // const result = await this.userRepository.signIn(req.body.email, req.body.password);

            // if(!result) {
            //     return res.status(400).send('Invalid Credentials');
            // }
            // } else {
            //     // 1. Create token
            //     const token = jwt.sign({userId: result.id, email: result.email}, 'QS0E7BxFK43MsuG5lhvsSk2XIWsi5JkH', {expiresIn: '1h'});

            //     // 2. Send token
            //         // return res.send('SignIn Successful');
            //     return res.status(200).send(token);
            // }
        } catch (err) {
            console.log(err);
            // throw new ApplicationError("Could not create user", 500);
            // next(err);
            return res.status(500).send("Something went wrong during SignIn");
        }
    }

    async resetPassword(req, res, next) {
        const {newPassword} = req.body;
        const userId = req.userId;
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        try {
            await this.userRepository.resetPassword(userId, hashedPassword);
            res.status(200).send("Password is reset");
        } catch(err) {
            console.log(err);
            return res.status(500).send("Something went wrong during SignIn");
        }
    }

}