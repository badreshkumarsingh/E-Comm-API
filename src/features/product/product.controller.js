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
            const { name, price, sizes} = req.body;
            const newProduct = new ProductModel(name, null, parseFloat(price), req.file.filename, null, sizes.split(',') );
            

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

    filterProducts(req, res) {
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const category = req.query.category;

        const result = ProductModel.filter(minPrice, maxPrice, category);
        res.status(200).send(result);
    }

    rateProduct(req, res, next) {
        // const {userId, productId, rating} = req.query
        console.log(req.query);

        try {

        const userId = req.query.userId;
        const productId = req.query.productId;
        // const rating = req.querys.rating;
        const rating = req.query.rating;

        // const error = ProductModel.rateProduct(userId, productId, rating);
        // try {
            ProductModel.rateProduct(userId, productId, rating);
        // } catch (err) {
        //     return res.status(400).send(err.message);
        // }
        // console.log(error);

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
        return res.status(200).send("Rating Added");
    }
    
}