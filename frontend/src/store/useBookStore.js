import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useBookStore = create((set) => ({
    isBookMark: false,
    isUnBookMark: false,
    isBookmarked: false,
    bookmarks: [],

    // Function to bookmark a vehicle
    setbookmark: async (data) => {
        try {
            const res = await axiosInstance.post("/book/setBookmark", data);

            if (res.data.success) {
                set({ isBookMark: true });
                toast.success("Vehicle bookmarked successfully!");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error("Bookmark error:", error);
            toast.error("Failed to bookmark vehicle.");
        }
    },

    // Function to remove a bookmark
    unsetbookmark: async (data) => {
        try {
            const res = await axiosInstance.post("/book/unsetBookmark", data);

            if (res.data.success) {
                set({ isUnBookMark: true });
                toast.success("Bookmark removed successfully!");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error("Unbookmark error:", error);
            toast.error("Failed to remove bookmark.");
        }
    },

    checkBookmark: async (data) => {
        try {
            const res = await axiosInstance.post("/book/checkBookmark", data);
            if (res.data.isBookmarked) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error checking bookmark:", error);
            return false;
        }
    },

    fetchAllBookmarks: async (data) => {
        try {
            const res = await axiosInstance.post("/book/fetchAllBookmarks", data);

            if (res.data.bookmarks && res.data.bookmarks.length > 0) {
                set({ bookmarks: res.data.bookmarks }); // Store bookmarks in Zustand state
            } else {
                set({ bookmarks: [] }); // Ensure bookmarks state is empty if none are found
            }
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
        }
    },

    verifyRide: async (data) => {
        try {
            const res = await axiosInstance.post("/book/verifyRide", data);
            return res.data; // Return response data
        } catch (error) {
            console.error("Error verifying ride:", error);
            toast.error(error.response?.data?.message || "Failed to verify ride");
            throw error; // Rethrow error for handling in the calling function
        }
    },

    UnverifyRide: async (data) => {
        try {
            const res = await axiosInstance.post("/book/UnverifyRide", data);
            return res.data; // Return response data
        } catch (error) {
            console.error("Error verifying ride:", error);
            toast.error(error.response?.data?.message || "Failed to Cancel verify ride");
            throw error; // Rethrow error for handling in the calling function
        }
    },

    checkBookStatus: async (data) => {
        try {
            const res = await axiosInstance.post("/book/checkBookStatus", data);
            return res.data; // Return the response data to the caller
        } catch (error) {
            console.error("Error checking booking status:", error);

            // Display error message in toast if available, otherwise show a generic message
            toast.error(error.response?.data?.message || "Failed to fetch booking status");

            throw error; // Rethrow the error so the calling function can handle it
        }
    }


}));
