import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        order_id: { type: String, required: true, unique: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        receipt: { type: String, required: true },
        status: { type: String, required: true },
    },
    { timestamps: true }
);
const Order = mongoose.model("Orders", orderSchema);


export default Order;
