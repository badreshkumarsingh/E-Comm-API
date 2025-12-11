import ProductModel from "./product.model.js";

export default class ProductController {

    getAllProducts(req, res) {
        const products = ProductModel.getAll();
        res.status(200).send(products);
    }

    addProduct(req, res) {
        // console.log(req.body);
        // console.log("This is a post request");
        // res.status(200).send("Product has been added");

        const { name, price, sizes} = req.body;
        const newProduct = {
            name: name,
            price: parseFloat(price),
            sizes: sizes.split(','),
            imageUrl: req.file.filename,
        };

        const createdRecord = ProductModel.add(newProduct);
        res.status(201).send(createdRecord);
    }

    getOneProduct(req, res) {
        const id = req.params.id;
        const product = ProductModel.get(id);
        if(!product) {
            return res.status(404).send('Product not found');
        } else {
            res.status(200).send(product);
        }
    }

    filterProducts(req, res) {
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const category = req.query.category;

        const result = ProductModel.filter(minPrice, maxPrice, category);
        res.status(200).send(result);
    }

    rateProduct(req, res) {
        // const {userId, productId, rating} = req.query
        console.log(req.query);
        const userId = req.query.userId;
        const productId = req.query.productId;
        const rating = req.query.rating;

        // const error = ProductModel.rateProduct(userId, productId, rating);
        try {
            ProductModel.rateProduct(userId, productId, rating);
        } catch (err) {
            return res.status(400).send(err.message);
        }
        // console.log(error);


        // if(error) {
        //     return res.status(400).send(error);
        // } else {
        //     return res.status(200).send("Rating Added");
        // }
        return res.status(200).send("Rating Added");
    }
    
}