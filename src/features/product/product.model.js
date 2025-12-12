import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";

export default class ProductModel {
    constructor(id, name, desc, price, imageUrl, category, sizes) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.sizes = sizes;
    }

    static getAll() {
        return products;
    }

    static add(product) {
        const newProduct = new ProductModel(
            products.length + 1,
            product.name,
            'This is new Product',
            product.price,
            product.imageUrl,
            'Category',
            product.sizes            
        )

        products.push(newProduct);
        return newProduct;
    }

    static get(id) {
      const product = products.find((p) => p.id == id);
      return product;
    }

    static filter(minPrice, maxPrice, category) {
      const filteredProducts = products.filter((p) => {
        return ((!minPrice || p.price >= minPrice) && (!maxPrice || p.price <= maxPrice) && (!category || p.category == category))
      });
      return filteredProducts;
    }

    static rateProduct(userId, productId, rating) {
      // 1. Validate user and product
      const user = UserModel.getAll().find(u => u.id == userId);
      if(!user) {
        // return "User not found";
        // User-defined error
        throw new ApplicationError("User not found", 404);
      }

      const product = products.find(p => p.id == productId);
      if(!product) {
        // return "Product not found";
        throw new ApplicationError("Product not found", 400);
      }

      // 2. Check if there are any existing ratings, and if not, add ratings array.
      if(!product.ratings) {
        product.ratings = [];
        product.ratings.push({userId: userId, rating: rating});
      } else {
        // 3. If user has previously given rating, update the rating at that index
        const existingRatingIndex = product.ratings.findIndex(r => r.userId == userId);

        if(existingRatingIndex >= 0) {
          product.ratings[existingRatingIndex] = {userId: userId, rating: rating};
        }  // 4. If user with userId has not given any rating previously
        else {
          product.ratings.push({
            userId: userId, rating: rating
          })
        }
      }

    }
}

var products = [
    new ProductModel(
      1,
      'Product 1',
      'Description for Product 1',
      19.99,
      'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
      'Category1',
      
    ),
    new ProductModel(
      2,
      'Product 2',
      'Description for Product 2',
      29.99,
      'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
      'Category2',
      ['M', 'XL']
    ),
    new ProductModel(
      3,
      'Product 3',
      'Description for Product 3',
      39.99,
      'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
      'Category3',
      ['S', 'M', 'XL']
    ),
]