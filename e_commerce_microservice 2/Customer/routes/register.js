const express = require('express');
const router = express.Router();
const Controller = require('../controller/auth')
const AuthController = new Controller()

/**
 * Handles customer information including customer profiles, authentication, and authorization.
Offers API endpoints for customer registration, profile updates, and data retrieval.
 */

router.post('/newcustomer', AuthController.register);

module.exports = router