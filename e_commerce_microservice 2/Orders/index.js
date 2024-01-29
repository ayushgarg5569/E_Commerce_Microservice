const express = require('express');

const app = express();

app.use(express.json());
const Controller = require('./controller/order')

app.use('/', (req,res,next) => {

    return res.status(200).json({"msg": "Hello from Order"})
})


app.listen(8002, () => {
    console.log('Order is Listening to Port 8002')
    new Controller().receiveMessage();
})