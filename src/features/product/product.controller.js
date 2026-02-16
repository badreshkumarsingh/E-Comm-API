import { ApplicationError } from "../../error-handler/applicationError.js";
import ProductModel from "./product.model.js";
import ProductRepository from './product.repository.js';

export default class ProductController {

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(req, res) {
        try {
            const products = await this.productRepository.getAll();
            res.status(200).send(products);
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Could not find all products", 500);
        }
    }

    async addProduct(req, res) {
        try {
            const { name, price, sizes, categories, description } = req.body;
            const newProduct = new ProductModel(name, description, parseFloat(price), req?.file?.filename, categories, sizes?.split(',') );
            

            const createdRecord = await this.productRepository.add(newProduct);
            res.status(201).send(createdRecord);
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Could not add", 500);
        }
    }

    async getOneProduct(req, res) {
        try {
            const id = req.params.id;
            const product = await this.productRepository.get(id);
            if(!product) {
            return res.status(404).send('Product not found');
            } else {
                res.status(200).send(product);
            }
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 500);
        }
        
        // const id = req.params.id;
        // const product = ProductModel.get(id);
        // if(!product) {
        //     return res.status(404).send('Product not found');
        // } else {
        //     res.status(200).send(product);
        // }
    }

    async filterProducts(req, res) {
        try {
            const minPrice = req.query.minPrice;
            const maxPrice = req.query.maxPrice;
            const category = req.query.category;

            const result = await this.productRepository.filter(minPrice, category);
            res.status(200).send(result);
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 500);
        }
    }

    async rateProduct(req, res, next) {
        // const {userId, productId, rating} = req.query
        console.log(req.query);

        try {

        const userId = req.userId;
        console.log("req.userId: ", req.userId);
        console.log("userId: ", userId);
        // const productId = req.query.productId;
        const productId = req.body.productId;
        // const rating = req.querys.rating;
        // const rating = req.query.rating;
        const rating = req.body.rating;

        // const error = ProductModel.rateProduct(userId, productId, rating);
        // try {
        await this.productRepository.rate(userId, productId, rating);
        return res.status(200).send("Rating Added");
        } catch (err) {
            console.log("Error in controller");
            next(err);
            return;
        }

        // if(error) {
        //     return res.status(400).send(error);
        // } else {
        //     return res.status(200).send("Rating Added");
        // }
        // return res.status(200).send("Rating Added");
    }
    

    async averagePrice(req, res, next) {
        try {
            const result = await this.productRepository.averageProductPricePerCategory();
            res.status(200).send(result);
        }catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong", 500);
        }
    }
}