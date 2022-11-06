const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://sneha:12345@cluster0.i0jnh1k.mongodb.net/?retryWrites=true&w=majority'
  )
    .then((client) => {
      console.log('Connected to mongoooooo');
      //if this database doesnt exist, it creates
      //if the mongo url has some other database, this overrides it
      _db = client.db('ecomsite');
      callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'no database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
