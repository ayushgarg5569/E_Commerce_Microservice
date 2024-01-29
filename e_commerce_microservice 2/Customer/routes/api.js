const express = require('express');
const router = express.Router();
const Controller = require('../controller/auth')
const AuthController = new Controller()

const { authenticateAccessToken } = require('../controller/jwt')
const { updateProfile } = require('../controller/CustomerController')

router.post('/customer/login', AuthController.login);

router.put('/customers/:id', authenticateAccessToken, updateProfile); //Update customer profile


module.exports = router
