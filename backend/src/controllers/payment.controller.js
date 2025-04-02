import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/order.model.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order function (existing)
export const createOrder = async (req, res) => {
    try {
        const { amount, currency, receipt, notes } = req.body;

        const options = {
            amount: amount * 100, // Convert amount to paise
            currency,
            receipt,
            notes,
        };

        // Create order using Razorpay API
        const order = await razorpay.orders.create(options);

        // Save order details to MongoDB
        const newOrder = new Order({
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            status: 'created',
        });
        await newOrder.save();

        // Send order details back to the client
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating order');
    }
};

// Verify Payment function
export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET; // Use the secret from environment variables
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    try {
        // Generate expected signature
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        if (generatedSignature === razorpay_signature) {
            // Update the order with payment details in MongoDB
            const order = await Order.findOne({ order_id: razorpay_order_id });
            if (order) {
                order.status = 'paid';
                order.payment_id = razorpay_payment_id;
                await order.save();
            }
            console.log("Payment verification successful");
            res.status(200).json({ status: 'ok', success: true });
        } else {
            console.log("Payment verification failed");
            res.status(400).json({ status: 'verification_failed', success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error verifying payment' });
    }
};


const secret = 'thbuuKqzs8nOKAonVYjRGrxY'; // Replace with your secret from .env
const order_id = 'order_QBh0wMhPsYFUPt';     // Use the order ID from your create order response
const payment_id = 'payment_TEST123';         // Use a test payment ID (you can choose any string)
const body = order_id + '|' + payment_id;

const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

console.log('Generated Signature:', generatedSignature);