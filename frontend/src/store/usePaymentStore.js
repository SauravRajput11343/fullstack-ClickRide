import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const usePaymentStore = create((set) => ({
    createOrder: async (orderData) => {
        try {
            // Call the backend endpoint to create an order
            const res = await axiosInstance.post("/payment/create-order", orderData);
            toast.success("Order created successfully!");
            return res.data; // Return the created order data
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error(error.response?.data?.message || "Failed to create order");
            throw error;
        }
    },

    verifyPayment: async (paymentData) => {
        try {
            // Call the backend endpoint to verify the payment
            const res = await axiosInstance.post("/payment/verify-payment", paymentData);
            // Depending on your API, this might return a boolean or an object
            return res.data;
        } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error(error.response?.data?.message || "Failed to verify payment");
            throw error;
        }
    }
}));
