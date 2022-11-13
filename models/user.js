const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = new mongodb.ObjectId(id);
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this)
      .then((res) => {
        console.log('Created new user');
      })
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      console.log(cp.productId);
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;

    //we cant override the cart with a new cart each time.. hence,

    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((item) => {
      return item.productId;
    });

    //find all the products that have same id as the products in productIds

    //then for each product, map the product Id with the quantity
    //from the cart object
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  addOrder() {
    const db = getDb();
    const order = {
      items: this.cart.items,
      user: {
        _id: this.name,
        name: this.name,
      },
    };
    return db
      .collection('orders')
      .insertOne(this.cart)
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db.collection('orders').find({});
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .find({ _id: new mongodb.ObjectId(userId) })
      .next()
      .then((user) => {
        console.log('Found user');
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
