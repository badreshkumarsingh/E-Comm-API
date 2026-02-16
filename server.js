// import dotenv from 'dotenv';
// dotenv.config();
import './env.js';

import express from 'express';
import bodyParser from 'body-parser';
import swagger from "swagger-ui-express";
import cors from "cors";

import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
// import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import cartRouter from './src/features/cartItems/cartItems.routes.js';
// import apiDocs from "./swagger.json" assert {type:"json"};
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { logger } from './src/middlewares/logger.middleware.js';
// import { readFileSync } from 'fs';
// const apiDocs = JSON.parse(readFileSync(new URL('./swagger.json', import.meta.url)));
import apiDocs from "./swagger.json" with {type:"json"};
import { ApplicationError } from "./src/error-handler/applicationError.js";
import { connectToMongoDB } from './src/config/mongodb.js';
import orderRouter from './src/features/order/order.routes.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import mongoose from 'mongoose';



const server = express();

// CORS policy configuration
// server.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
//     // res.header("Access-Control-Allow-Headers", "*");
//     // res.header("Access-Control-Allow-Methods", "*");

//     if(req.method == "OPTIONS") {
//         res.sendStatus(200);
//     }
//     // Return OK for preflight request
//     next();
// });

var corsOptions = {
    origin: "http://127.0.0.1:5500",
    // allowedHeaders: "*",
}

server.use(cors(corsOptions));

server.use(bodyParser.json());

// For all requests related to product, redirect to product routes
// server.use('/api/products', basicAuthorizer, productRouter);
// path for API for sending API Documentation is also required
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

server.use(loggerMiddleware);

server.use('/api/orders', jwtAuth, orderRouter);

server.use('/api/products', jwtAuth, productRouter);

server.use('/api/users', userRouter);

server.use('/api/cartItems', jwtAuth, cartRouter);

// 3. Default request handler
server.get('/', (req, res) => {
    res.send('Welcome to REST API creation');
});



// 4. Middleware for handling requests that will lead to 404 response to them
server.use((req, res) => {
    res.status(404).send("API Not Found. Please Check our Documentation for More Information at /api-docs");
});

// Error handler middleware
server.use((err, req, res, next) => {
    console.log(err);
    const logData = `${new Date().toString()} ${req.url} - ${JSON.stringify(req.body)} - ERROR ${err.message}`;
            // console.log(logData);
            // await log(logData);
    logger.info(logData);

    if(err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(err.message);
    }

    if(err instanceof ApplicationError) {
        res.status(err.code).send(err.message);
        return;
    }

    // Server-error 
    res.status(500).send("Something went wrong. Please try again later.");
});

server.listen(3100, () => {
    console.log('Server is listening at http://localhost:3100');
    // connectToMongoDB();
    connectUsingMongoose();
});