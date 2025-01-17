import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"

import toast from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom';


export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    UserRole: null,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")

            set({
                authUser: res.data,
                UserRole: res.data.roleName
            });
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({
                authUser: null,
                UserRole: null
            });
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account successfully created")
            return { success: true };
        } catch (error) {
            toast.error(error.response.data.message);
            return { success: false };

        }
    },
   
    login: async (data) => {
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });

            toast.success("Successfully LoggedIn")
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message);
            return null

        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Successfully Logged Out");
        } catch (error) {
            toast.error("Logout failed: " + error.response?.data?.message || "Something went wrong");
        }
    },

    updateProfilepic: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/updateProfile", data);
            set({ authUser: res.data });
            toast.success("Profile Updated successfully");
        } catch (error) {
            console.log("error in update profile: ", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    fetchUserData: async () => {
        try {
            const res = await axiosInstance.get("/auth/users"); // Adjust the endpoint as needed
            const data = res.data;

            set({
                totalCustomers: data.totalCustomers,
                totalPartners: data.totalPartners,
                customerDetails: data.customerDetails,
                partnerDetails: data.partnerDetails,
            });
        } catch (error) {
            console.error("Error fetching user stats:", error);
            toast.error("Failed to fetch user data");
        }
    },

    

}));