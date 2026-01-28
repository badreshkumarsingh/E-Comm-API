import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileUpload.middleware.js";

// Initialize the router
const productRouter = express.Router();

// Create an instance of the ProductController
const productController = new ProductController();

// Define the routes and associate them with the controller methods
// http://localhost:3100/api/products/filter?minPrice=10&maxPrice=50&category=Category1
productRouter.post('/rate', productController.rateProduct);
productRouter.get('/filter', productController.filterProducts);
productRouter.get('/', (req, res) => {
    productController.getAllProducts(req, res);
});
// productRouter.post('/', upload.array('imageUrl'), productController.addProduct);
productRouter.post('/', upload.single('imageUrl'), (req, res) => {
    productController.addProduct(req, res);
});
productRouter.get('/:id', (req, res) => {
    productController.getOneProduct(req, res);
});



export default productRouter;