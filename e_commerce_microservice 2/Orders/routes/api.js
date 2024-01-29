
/**
Responsible for order processing, including order creation, status updates, and history tracking.
Integrates with both Product and Customer Services to validate orders and update stock levels
 */
const express = require('express');
const router = express.Router();
const Controller = require('../controller/order')
const orders = new Controller()

router.put('/orders/:id', orders.updateOrder); //Update order status

router.get('/orders/:id', orders.getOrderDetailById); //Retrieve order details

module.exports = router