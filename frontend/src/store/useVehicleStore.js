import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";


export const useVehicleStore = create((set) => ({

    isAddingVehicle: false,
    isUpdatingVehicle: false,
    isDeletingVehicle: false,
    isUpdatingModel: false,
    isDeletingModel: false,
    isDeleteingRequest: false,
    isRequesting: false,
    isRejecting: false,
    isUpdating: false,
    vehicles: [],
    vehicleDetails: [],
    vehicleModelDetails: [],
    updateResponce: [],
    totalUpdateRequest: [],
    totalUpdateResponce: [],


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

    vehicleUpdateRequest: async (requestdata) => {
        try {
            set({ isRequesting: true })
            const res = await axiosInstance.post('/vehicle/vehicleUpdateRequest', requestdata);
            const data = res.data;
            if (data.success) {
                set({
                    updateResponce: data.UpdateRequest,
                });
            };
            toast.success("Vehicle update request send successfully!");
            return { success: true };
        } catch (error) {
            console.error("Error fetching vehicle stats:", error);
            toast.error("Failed to fetch vehicle data");
            return { success: false };
        } finally {
            set({ isRequesting: false })

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

    fetchVehicleUpdateRequestData: async (statusData) => {
        try {
            const res = await axiosInstance.get("/vehicle/vehicelPendingUpdateRequestData", statusData); // Adjust the endpoint as needed
            const data = res.data;

            if (data && typeof data.totalUpdateRequest === "number" && Array.isArray(data.totalUpdateResponce)) {
                set({
                    totalUpdateRequest: data.totalUpdateRequest,
                    totalUpdateResponce: data.totalUpdateResponce,
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

    UpdateRequestStatus: async (requestData) => {
        try {
            set({ isUpdating: true });
            const res = await axiosInstance.post("/vehicle/updateRequestStatus", requestData);
            const data = res.data;

            if (data && data.success) {
                toast.success("Request status updated successfully");
                return data;  // Returning the response for further processing if needed
            } else {
                // If the response does not indicate success
                const errorMessage = data?.message || "Failed to update request status";
                toast.error(errorMessage);
                return null;  // Returning null if update failed
            }

        } catch (error) {
            console.error("Error updating request status:", error);
            toast.error("Failed to update request status");
            return null;  // Returning null in case of an error
        } finally {
            set({ isUpdating: false });
        }
    },

    DeleteRequest: async (deleteRequest) => {
        try {
            set({ isDeleteingRequest: true });
            const res = await axiosInstance.post("/vehicle/vehicleDeleteRequest", deleteRequest);
            const data = res.data;

            if (data && data.success) {
                toast.success("Request Deleted successfully");
                return data;
            } else {
                const errorMessage = data?.message || "Failed to delete request";
                toast.error(errorMessage);
                return null;
            }

        } catch (error) {
            console.error("Error deleting request status:", error);
            toast.error("Failed to delete request status");
            return null;
        } finally {
            set({ isDeleteingRequest: false });
        }
    }

}));
