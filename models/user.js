const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .createOne(this)
      .then((res) => {
        console.log('Created new user');
        console.log(res);
      })
      .catch((err) => console.log(err));
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
