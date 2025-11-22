import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";


export default class UserController {
    signUp(req, res) {
        const {name, email, password, type} = req.body;
        const newUser = UserModel.signUp(name, email, password, type);
        res.status(201).send(newUser);
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