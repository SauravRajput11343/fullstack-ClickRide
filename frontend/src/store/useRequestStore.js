import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useRequestStore = create((set) => ({
    isVerified: false,
    isCancel: false,

    // Function to verify a vehicle
    verifiedVehicle: async (data) => {
        try {
            const res = await axiosInstance.post("/request/verifiedVehicle", data);

            if (res.status === 200) {
                set({ isVerified: true });
                toast.success("Vehicle verified successfully!");
            }
            return res;
        } catch (error) {
            console.error("Error verifying vehicle:", error);
            toast.error("Failed to verify vehicle.");
        }
    },

    // Function to cancel a vehicle request
    cancelledVehicle: async (data) => {
        try {
            const res = await axiosInstance.post("/request/cancelledVehicle", data);

            if (res.status === 200) {
                set({ isCancel: true });
                toast.success("Vehicle request cancelled successfully!");
            }
            return res;
        } catch (error) {
            console.error("Error cancelling vehicle request:", error);
            toast.error("Failed to cancel vehicle request.");
        }
    },

    fetchAllVehicleRequest: async () => {
        try {
            const res = await axiosInstance.get("/request/fetchAllVehicleRequest");
            return res.data; // Return the fetched data
        } catch (error) {
            console.error("Error fetching vehicle requests:", error);
            throw error; // Propagate the error for handling
        }
    }

}));
