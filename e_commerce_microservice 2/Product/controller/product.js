const ProductsRepository = require("..models");
const { deleteMessages, readMessages, sendMessage } = require('../Util/sqs')

class ProductsService {
    constructor() {
        this.productsRepository = new ProductsRepository();
    }

    async addProduct(req, res) {
        try {
            let { name, description, price, quantity } = req.body
            const createdProduct = await this.productsRepository.addProduct(name, description, price, quantity);

            return res.json({ success: true, message: "Product added successfully" });

        } catch (error) {
            res.send({ message: error.message });
        }
    }

    async getProductDetailById(req, res) {
        try {
            const productId = req.params.productId
            const product = await this.productsRepository.findById(productId);
            if (!product)
                throw new Error("Product not found")
            return res.json({ success: true, message: "Product details found", data: product });
        } catch (error) {
            res.send({ message: error.message });
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await this.productsRepository.findAll();

            return res.json({ success: true, message: "Products details found", data: products });
        } catch (error) {
            res.send({ message: error.message });
        }

    }

    async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const updatedData = req.body; // Assuming the updated data is sent in the request body

            // Perform the update in your database
            const updatedProduct = await this.productsRepository.findByIdAndUpdate(productId, updatedData, { new: true });

            if (!updatedProduct) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            // If the update is successful, return the updated customer data
            return res.json({ success: true, data: updatedProduct });

        } catch (error) {
            res.send({ message: error.message });
        }

    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.id;

            const deleteProduct = await this.productsRepository.deleteProduct(productId, { new: true });

            return res.json({ success: true, message: "Product deleted." });

        } catch (error) {
            res.send({ message: error.message });
        }

    }

    async buyProduct(req, res) {
        try {
            // Extract order details from the request body
            const orderDetails = req.body; // customer details and product details

            // Publish order details to the SQS queue
            const orderQueueURL = process.env.sqsUrl;
            await sendMessage(orderQueueURL, orderDetails);

            const productURL = process.env.sqsUrl;
            let orderDetails = []
            await readMessages(productURL, async (error, result) => {
                if (error) {
                    console.log("Unable to fetch order from SQS: ", error);
                } else {
                    orderDetails = result.Messages ? result.Messages : [];
                    // update stock
                    await this.updateProductStock(orderDetails);
                }
            });

            return res.status(200).json({ success: true, message: 'Order placed successfully.', data: orderDetails });
        } catch (error) {
            console.error('Error placing order:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    async updateProductStock(orderDetails) {
        try {
            let { orderStatus, productId, quantity } = JSON.parse(orderDetails);

            const productDetails = await this.productsRepository.findById(productId);

            const updatedData = {
                quantity: orderStatus == 'cancelled' ? (productDetails.quantity + quantity) : ((productDetails.quantity - quantity) ?? 0)
            }
            const updatedProduct = await this.productsRepository.findByIdAndUpdate(productId, updatedData, { new: true });

            //delete message from queue after successfuly updating product stocks
            const productsQueueURL = process.env.sqsUrl;
            await sqsUtil.deleteMessages(orderDetails.ReceiptHandle, productsQueueURL);


        } catch (error) {
            console.error('Error placing order:', error);
        }
    }

    async receiveMessage() {
        try {
            /** this  is called only in case of order cancellation */
            const productURL = process.env.sqsUrl;
            await sqsUtil.readMessages(productURL, async (error, result) => {
                if (error) {
                    console.log("Unable to fetch order from SQS: ", error);
                    setTimeout(this.receiveMessage, 500);

                } else {

                    const orders = result.Messages ? result.Messages : [];
                    if (orders.orderStatus == 'cancelled') {
                        await this.updateProductStock(orders);

                    }
                    setTimeout(this.receiveMessage, 500);
                }
            });

        } catch (error) {
            console.error('Error placing order:', error);
        }
    }
}

module.exports = ProductsService;