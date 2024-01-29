const express = require('express');

const app = express();

app.use(express.json());
const Controller = require('./controller/product')
app.use('/', (req,res,next) => {

    return res.status(200).json({"msg": "Hello from Product"})
})


app.listen(8003, () => {
    console.log('Product is Listening to Port 8003')
    new Controller().receiveMessage();
})