import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import { ApplicationError } from "../../error-handler/applicationError.js";
import UserRepository from "./user.repository.js";


export default class UserController {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async signUp(req, res) {
        try {
            const {name, email, password, type} = req.body;
            const newUser = new UserModel(name, email, password, type);
            await this.userRepository.signUp(newUser);
            res.status(201).send(newUser);
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Could not create user", 500);
        }
        // res.status(201).send(newUser);
    }

    signIn(req, res) {
        const result = UserModel.signIn(req.body.email, req.body.password);

        if(!result) {
            return res.status(400).send('Invalid Credentials');
        } else {
            // 1. Create token
            const token = jwt.sign({userId: result.id, email: result.email}, 'QS0E7BxFK43MsuG5lhvsSk2XIWsi5JkH', {expiresIn: '1h'});

            // 2. Send token
                // return res.send('SignIn Successful');
            return res.status(200).send(token);

        }
    }

}