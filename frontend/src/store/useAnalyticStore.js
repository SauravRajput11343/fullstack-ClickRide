import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAnalyticStore = create((set) => ({
    isLoading: false,
    analyticsData: null,

    adminAnalysis: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/analytics/getAdminAnalytics");
            set({ analyticsData: res.data });
        } catch (error) {
            toast.error("Failed to fetch admin analytics.");
            console.error("Analytics Error:", error);
        } finally {
            set({ isLoading: false });
        }
    }
}));
