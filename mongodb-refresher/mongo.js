const MongoClient = require('mongodb').MongoClient;

const url = process.env.URL;

const createProduct = async (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    price: req.body.price
  };

  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db();
    const result = db.collection('products').insertOne(newProduct);
  } catch (error) {
    return res.json({ message: 'Could not store data.' });
  };

  client.close();
  res.json(newProduct);
};

const getProducts = async (req, res, next) => {};

module.exports = {
  createProduct,
  getProducts
};
