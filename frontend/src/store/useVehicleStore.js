import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";


export const useVehicleStore = create((set) => ({

    isAddingVehicle: false,
    isUpdatingVehicle: false,
    isDeletingVehicle: false,
    isUpdatingModel: false,
    isDeletingModel: false,
    vehicles: [],
    vehicleDetails: [],
    vehicleModelDetails: [],

    addVehicles: async (data) => {
        try {
            set({ isAddingVehicle: true })
            const res = await axiosInstance.post("/vehicle/addVehicle", data);
            set((state) => ({
                vehicles: [...state.vehicles, res.data],
            }));
            return { success: true };
        } catch (error) {
            return { success: false };

        } finally {
            set({ isAddingVehicle: false })
        }
    },

    fetchVehicleData: async () => {
        try {
            const res = await axiosInstance.get("/vehicle/vehicles"); // Adjust the endpoint as needed
            const data = res.data;

            if (data && typeof data.totalVehicles === "number" && Array.isArray(data.vehicleDetails)) {
                set({
                    totalVehicles: data.totalVehicles,
                    vehicleDetails: data.vehicleDetails,
                });
            } else {
                console.error("Invalid response structure for vehicles:", data);
                toast.error("Received invalid vehicle data");
            }
        } catch (error) {
            console.error("Error fetching vehicle stats:", error);
            toast.error("Failed to fetch vehicle data");
        }
    },

    fetchOneVehicleData: async (id) => {
        try {
            const res = await axiosInstance.get(`/vehicle/vehicles/${id}`);
            const data = res.data;

            set({
                vehicleDetails: data.vehicleDetails,
            });
            return data.vehicleDetails;
        } catch (error) {
            console.error("Error fetching vehicle stats:", error);
            toast.error("Failed to fetch vehicle data");
        }
    },

    UpdateOneVehicleData: async (updatedata) => {
        try {
            set({ isUpdatingVehicle: true })
            const res = await axiosInstance.post(`/vehicle/updatevehicle`, updatedata);
            const data = res.data;

            toast.success("Vehicle data updated successfully!");
            return { success: true };
        } catch (error) {
            console.error("Error fetching vehicle stats:", error);
            toast.error("Failed to fetch vehicle data");
            return { success: false };
        } finally {
            set({ isUpdatingVehicle: false })
        }
    },

    DeleteOneVehicleData: async (deletedata) => {
        try {
            set({ isDeletingVehicle: true })
            const res = await axiosInstance.post(`/vehicle/deleteVehicle`, deletedata);
            const data = res.data;

            toast.success("Vehicle data deleted successfully!");
            return { success: true };
        } catch (error) {
            console.error("Error fetching vehicle stats:", error);
            toast.error("Failed to fetch vehicle data");
            return { success: false };
        } finally {
            set({ isDeletingVehicle: false })

        }
    },

    fetchVehicleModelData: async () => {
        try {
            // Make API request
            const res = await axiosInstance.get("/vehicle/vehiclesModel"); // Adjust the endpoint as needed
            const data = res.data;

            // Check if data structure matches the expected format
            if (
                data &&
                typeof data.totalVehicleModels === "number" &&
                Array.isArray(data.vehicleModelDetails)
            ) {
                set({
                    totalVehicleModels: data.totalVehicleModels,
                    vehicleModelDetails: data.vehicleModelDetails,
                });
            } else {
                console.error("Invalid response structure for vehicle models:", data);
                toast.error("Received invalid vehicle model data");
            }
        } catch (error) {
            console.error("Error fetching vehicle model stats:", error);
            toast.error("Failed to fetch vehicle model data");
        }
    },
    updateVehicleModel: async (updateModelData) => {

        try {
            set({ isUpdatingModel: true });
            const res = await axiosInstance.put("/vehicle/updateModelPic", updateModelData);

            return { success: true };
        } catch (error) {
            toast.error(error.response.data.message);
            return { success: false };
        } finally {
            set({ isUpdatingModel: false })
        }
    },

    deleteVehicleModel: async (DeleteModelData) => {

        try {
            set({ isDeletingModel: true });
            const res = await axiosInstance.post("/vehicle/DeleteModel", DeleteModelData);
            return { success: true };
        } catch (error) {
            toast.error(error.response.data.message);
            return { success: false };
        } finally {
            set({ isDeletingModel: false })
        }
    },
}));
