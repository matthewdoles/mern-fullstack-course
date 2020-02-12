const mongoClient = require('mongodb').MongoClient;

console.log(process.env.URL);
const url = process.env.URL;

const createProduct = async (req, res, next) => {};

const getProducts = async (req, res, next) => {};

module.export = {
  createProduct,
  getProducts
};