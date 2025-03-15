import VehicleRequest from "../models/vehicleRequest.model.js";
import VehicleInstance from "../models/vehicleInstance.model.js";

export const verifiedVehicle = async (req, res) => {
    try {
        const {
            requestId
        } = req.body;

        if (!requestId) {
            return res.status(400).json({ error: "Request ID is required" });
        }

        // Find request
        const request = await VehicleRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        // Find vehicle and update
        const vehicle = await VehicleInstance.findById(request.vehicleId);
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        vehicle.verify = true;
        vehicle.availabilityStatus = "Available";
        await vehicle.save();

        // Update request status
        request.status = "approved";
        await request.save();

        return res.status(200).json({ message: "Vehicle verified successfully" });
    } catch (error) {
        console.error("Error verifying vehicle:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const cancelledVehicle = async (req, res) => {
    try {
        const {
            requestId
        } = req.body;

        if (!requestId) {
            return res.status(400).json({ error: "Request ID is required" });
        }

        // Find request
        const request = await VehicleRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        // Find and delete vehicle
        const vehicle = await VehicleInstance.findById(request.vehicleId);
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        await VehicleInstance.findByIdAndDelete(request.vehicleId);

        // Delete the vehicle request itself
        await VehicleRequest.findByIdAndDelete(requestId);

        return res.status(200).json({ message: "Vehicle request deleted successfully" });
    } catch (error) {
        console.error("Error cancelling vehicle request:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const fetchAllVehicleRequest = async (req, res) => {
    try {
        // Fetch all vehicle requests
        const vehicleRequests = await VehicleRequest.find({})
            .populate({
                path: 'vehicleId',
                populate: { path: 'vehicleImagesId' }
            })  // Populate vehicle details
            .populate('requestedBy'); // Populate user details who made the request

        // Categorizing requests based on status
        const pendingRequests = vehicleRequests.filter(req => req.status === 'pending');
        const approvedRequests = vehicleRequests.filter(req => req.status === 'approve');
        const reviewRequests = vehicleRequests.filter(req => req.status === 'review');

        res.status(200).json({
            success: true,
            totalRequests: vehicleRequests.length,
            pendingRequests: pendingRequests.length,
            approvedRequests: approvedRequests.length,
            reviewRequests: reviewRequests.length,
            requests: vehicleRequests // Sending all requests if needed
        });
    } catch (error) {
        console.error('Error fetching vehicle requests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
