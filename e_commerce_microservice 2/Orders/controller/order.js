const orderModels = require("../models");
const sqsUtil = require('../Util/sqs')
const {deleteMessages, readMessages, sendMessage} = require('../Util/sqs')

class ProductsService {
    constructor() {
        this.orders = new orderModels();
    }

    async getOrderDetailById(req, res) {
        try {
            const orderId = req.params.orderId
            const order = await this.orders.findById(orderId);
            if (!order)
                throw new Error("Order not found")
            return res.json({ success: true, message: "Order details found", data: order });
        } catch (error) {
            res.send({ message: error.message });
        }
    }

    async getAllOrders(req, res) {
        try {
            const products = await this.orders.findAll();

            return res.json({ success: true, message: "Order details found", data: products });
        } catch (error) {
            res.send({ message: error.message });
        }

    }

    async updateOrder(req, res) {
        try {
            const orderId = req.params.id;
            const updatedData = req.body; // oder status

            // Perform the update in your database
            const updatedOrder = await this.orders.findByIdAndUpdate(orderId, updatedData, { new: true });

            if (!updatedOrder) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }

            // Publish order details to the productsSQS queue to update stock in case of cancellation
            const productsQueueURL = process.env.sqsUrl;
            await sqsUtil.sendMessage(productsQueueURL, orderDetails) // 

            // If the update is successful, return the updated customer data
            return res.json({ success: true, data: updatedOrder });

        } catch (error) {
            res.send({ message: error.message });
        }

    }

    async createOrder(orderDetails) {
        try {
            let { customerId, productId, quantity, price } = JSON.parse(orderDetails)
            const orderId = await this.orders.addOrder(customerId, productId, quantity, price); //save order details in db

            //delete message from queue after successfuly saving order
            const orderQueueURL = process.env.sqsUrl;
            await sqsUtil.deleteMessages(orderDetails.ReceiptHandle, orderQueueURL);

            // Publish order details to the productsSQS queue to update stock 
            const productsQueueURL = process.env.sqsUrl;
            orderDetails.orderId = orderId
            await sqsUtil.sendMessage(productsQueueURL, orderDetails)

        } catch (error) {
            console.error('Error placing order:', error);
        }
    }

    async receiveMessage () {
        try {
            const orderQueueURL = process.env.sqsUrl;
            await sqsUtil.readMessages(orderQueueURL, async (error, result) => {
              if (error) {
                console.log("Unable to fetch order from SQS: ", error);
                setTimeout(this.receiveMessage, 500);
              } else {
                const orders = result.Messages ? result.Messages : [];
                await createOrder(orders);
                setTimeout(this.receiveMessage, 500);
              }
            });
        
        } catch (error) {
            console.error('Error placing order:', error);
        }
    }
}

module.exports = ProductsService;