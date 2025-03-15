import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useReviewStore = create((set) => ({
    isAddingReview: false,
    isEditingReview: false,
    isDeletingReview: false,
    isRating: false,

    // Add a new review
    addReview: async (reviewData) => {
        set({ isAddingReview: true });
        try {
            const res = await axiosInstance.post("/review/addReview", reviewData);
            toast.success("Review added successfully!");
            return res.data;
        } catch (error) {
            console.error("Error adding review:", error);
            toast.error(error.response?.data?.message || "Failed to add review");
            throw error;
        } finally {
            set({ isAddingReview: false });
        }
    },

    // Edit an existing review
    editReview: async (updatedData) => {
        set({ isEditingReview: true }); // Set loading state
        try {
            const res = await axiosInstance.post('/review/editReview', updatedData);
            toast.success("Review updated successfully!");
            return res.data;
        } catch (error) {
            console.error("Error editing review:", error);
            toast.error(error.response?.data?.message || "Failed to update review");
            throw error;
        } finally {
            set({ isEditingReview: false });
        }
    },


    deleteReview: async (deleteData) => {
        set({ isDeletingReview: true });
        try {
            const res = await axiosInstance.post('/review/deleteReview', deleteData);
            toast.success("Review deleted successfully!");
            return res.data;
        } catch (error) {
            console.error("Error deleting review:", error);
            toast.error(error.response?.data?.message || "Failed to delete review");
            throw error;
        } finally {
            set({ isDeletingReview: false });
        }
    },

    // Fetch reviews
    fetchReview: async (fetchData) => {
        set({ isFetching: true });
        try {
            const res = await axiosInstance.post('/review/fetchReview', fetchData);
            return res.data;
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error(error.response?.data?.message || "Failed to fetch reviews");
            throw error;
        } finally {
            set({ isFetching: false });
        }
    },

    vehicleRating: async (fetchData) => {
        set({ isRating: true });
        try {
            const { data } = await axiosInstance.post('/review/vehicleRating', fetchData);
            return data;
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error(error.response?.data?.message || "Failed to fetch reviews");
            throw error;
        } finally {
            set({ isRating: false });
        }
    },

}));