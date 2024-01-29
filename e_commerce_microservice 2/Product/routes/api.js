/**
Manages product details such as name, description, price, and stock levels.
Provides endpoints for adding, updating, retrieving, and deleting products.
 */
const express = require('express');
const router = express.Router();
const Controller = require('../controller/product')
const products = new Controller()

router.get('/products', products.getAllProducts); //Retrieve all products

router.post('/products/add', products.addProduct); //Add a new product

router.put('/products/:id', products.updateProduct); //Update products

router.get('/products/:id', products.getProductDetailById); //Retrieve product details

router.delete('/products/:id', products.deleteProduct); //delete product details

router.post('/products/buy', products.buyProduct);


module.exports = router
