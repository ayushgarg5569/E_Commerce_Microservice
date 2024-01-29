

// const orderSchema = new mongoose.Schema({
//   customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
//   products: [
//     {
//       product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//       quantity: { type: Number, required: true },
//     },
//   ],
// totalPrice: {
//     type: Number,
//     required: true,
// }
//   status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
// ,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },

//   // Add other order details as needed
// });

// const Order = mongoose.model('Order', orderSchema);

// module.exports = Order;
/**
 * MySQL could also be chosen since it's suitable for handling transactional data with ACID properties.
 */
