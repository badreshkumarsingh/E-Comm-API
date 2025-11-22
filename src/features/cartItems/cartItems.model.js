

export default class CartItemsModel {
    constructor(productId, userId, quantity, id) {
        this.productId = productId;
        this.userId = userId;
        this.quantity = quantity;
        this.id = id;
    }

    static add(productId, userId, quantity) {
        const cartItem = new CartItemsModel(productId, userId, quantity, cartItems.length+1);
        cartItems.push(cartItem);
        return cartItem;
    }

    static get(userId) {
        // let userCart = [];
        // userCart = cartItems.filter( cartItem => cartItem.userId == userId);
        // console.log(userCart);
        // return userCart;
        return cartItems.filter((cartItem) => cartItem.userId == userId);
    }

    static delete(cartItemId, userId) {
        console.log(cartItemId);
        console.log(userId);
        const cartItemIndex = cartItems.findIndex((cartItem) => cartItem.id == cartItemId && cartItem.userId == userId);
        console.log(cartItemIndex);

        if(cartItemIndex == -1) {
            return "Item not found";
        } else {
            // const newCartItems = cartItems.splice(cartItemIndex, 1);
            // return newCartItems;
            cartItems.splice(cartItemIndex, 1);
        }
    }
}

let cartItems = [ new CartItemsModel(1, 2, 1, 1), new CartItemsModel(1, 1, 2, 2)];