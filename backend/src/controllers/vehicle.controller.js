import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import VehicleInstance from "../models/vehicleInstance.model.js";
import VehicleModel from "../models/vehicleModel.model.js";
import VehicleUpdateRequest from "../models/vehicleUpdateRequest.model.js";
import { getFileNameFromUrl } from "../lib/utils.js";
import { populate } from "dotenv";


export const addVehicle = async (req, res) => {
    try {
        const {
            vehicleType,
            vehicleMake,
            vehicleModel,
            vehicleSeat,
            vehicleTransmission,
            vehicleFuelType,
            pricePerDay,
            pricePerHour,
            vehicleRegNumber,
            manufacturingYear,
            vehiclePic,
            modelPic, // This will be base64 image or URL
            availabilityStatus,
            userID,
        } = req.body;

        // Validate required fields
        if (
            !vehicleType ||
            !vehicleMake ||
            !vehicleModel ||
            !vehicleSeat ||
            !vehicleTransmission ||
            !vehicleFuelType ||
            !pricePerDay ||
            !pricePerHour ||
            !vehicleRegNumber ||
            !manufacturingYear ||
            !availabilityStatus ||
            !vehiclePic ||
            !userID
        ) {
            return res.status(400).json({ message: "All vehicle details are required" });
        }
        console.log(userID)
        let model = await VehicleModel.findOne({
            vehicleType,
            vehicleMake,
            vehicleModel,
        });

        let uploadedModelPicUrl = modelPic;
        if (!model && modelPic && !modelPic.startsWith("http")) {
            const uploadedModelPic = await cloudinary.uploader.upload(modelPic, {
                folder: "vehicle_model_pictures",
                quality: "auto:low",
                width: 800,
                height: 600,
                crop: "fit",
                format: "webp",
            });
            uploadedModelPicUrl = uploadedModelPic.secure_url;
        }


        if (!model) {
            model = new VehicleModel({
                vehicleType,
                vehicleMake,
                vehicleModel,
                modelPic: uploadedModelPicUrl,
            });
            await model.save();

        }

        // Ensure model ID is valid
        if (!model || !model._id) {
            return res.status(500).json({ message: "Vehicle model reference is invalid" });
        }

        // Check for an existing vehicle with the same registration number
        const existingVehicle = await VehicleInstance.findOne({ vehicleRegNumber });


        if (existingVehicle) {
            return res.status(400).json({
                message: "Vehicle with this registration number already exists",
            });
        }


        let uploadedPicUrl = vehiclePic;
        if (vehiclePic && !vehiclePic.startsWith("http")) {
            const uploadedPic = await cloudinary.uploader.upload(vehiclePic, {
                folder: "vehicle_pictures",
                quality: "auto:low",
                width: 800,
                height: 600,
                crop: "fit",
                format: "webp",
            });
            uploadedPicUrl = uploadedPic.secure_url;
        }

        // Create a new VehicleInstance
        const newVehicleInstance = new VehicleInstance({
            modelID: model._id, // Reference to the VehicleModel
            vehicleRegNumber,
            manufacturingYear,
            vehiclePic: uploadedPicUrl,
            availabilityStatus,
            vehicleSeat,
            vehicleTransmission,
            vehicleFuelType,
            pricePerDay,
            pricePerHour,
            owner: userID,
        });


        // Save the vehicle instance
        await newVehicleInstance.save();

        // Populate the model reference
        const populatedVehicleInstance = await newVehicleInstance.populate("modelID");

        // Respond with the newly created vehicle instance
        res.status(201).json({
            success: true,
            vehicle: populatedVehicleInstance,
        });
    } catch (error) {


        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation Error",
                errors: error.errors,
            });
        }

        res.status(500).json({ message: "An error occurred while adding the vehicle" });
    }
};

export const updateModelPic = async (req, res) => {
    try {
        const { modelPic, modelID } = req.body;

        // Validate inputs
        if (!modelPic) {
            return res.status(400).json({ message: "Vehicle picture is required" });
        }

        if (!modelID) {
            return res.status(400).json({ message: "Vehicle model ID is required" });
        }

        const model = await VehicleModel.findById(modelID);
        if (!model) {
            return res.status(404).json({ message: "Vehicle model not found" });
        }

        if (model.modelPic) {
            const publicId = getFileNameFromUrl(model.modelPic);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
            }
        }

        const uploadResponse = await cloudinary.uploader.upload(modelPic, {
            folder: "vehicle_model_pictures",
            quality: "auto:low",
            width: 800,
            height: 600,
            crop: "fit",
            format: "webp",
        });

        const updatedVehicleModel = await VehicleModel.findByIdAndUpdate(
            modelID,
            { modelPic: uploadResponse.secure_url },
            { new: true }
        );

        if (!updatedVehicleModel) {
            return res.status(404).json({ message: "Vehicle model not found" });
        }

        return res.status(200).json({
            message: "Vehicle model picture updated successfully",
            updatedVehicleModel
        });

    } catch (error) {
        console.error("Error in updateModelPic function:", error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


export const totalVehicle = async (req, res) => {
    try {
        // Fetch all vehicles
        const vehicles = await VehicleInstance.find({})
            .populate('modelID')

        // Count the vehicles
        const totalVehicles = vehicles.length;

        res.status(200).json({
            totalVehicles,
            vehicleDetails: vehicles,
        });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const vehicleData = async (req, res) => {
    try {
        // Fetch all vehicles
        const vehicles = await VehicleInstance.findById(req.params.id).populate('modelID').populate({
            path: 'owner',
            select: 'email roleId',
            populate: {
                path: 'roleId',
                select: 'roleName'
            }
        });;


        res.status(200).json({
            vehicleDetails: vehicles,
        });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateVehicleData = async (req, res) => {
    try {
        // Get the updated data from the request body
        const {
            vehicleID,
            vehicleSeat,
            vehicleTransmission,
            vehicleFuelType,
            vehiclePic,
            vehicleRegNumber,
            manufacturingYear,
            pricePerDay,
            pricePerHour,
            availabilityStatus
        } = req.body;

        const vehicle = await VehicleInstance.findById(vehicleID);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        let uploadedPicUrl = vehiclePic;


        if (vehiclePic && !vehiclePic.startsWith("http")) {
            // Delete previous vehicle picture if it exists
            if (vehicle.vehiclePic) {
                const publicId = getFileNameFromUrl(vehicle.vehiclePic);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
                }
            }

            // Upload new vehicle picture to Cloudinary
            const uploadedPic = await cloudinary.uploader.upload(vehiclePic, {
                folder: "vehicle_pictures",
                quality: "auto:low",
                width: 800,
                height: 600,
                crop: "fit",
                format: "webp",
            });
            uploadedPicUrl = uploadedPic.secure_url;
        }

        // Find the vehicle by the provided vehicleID (which should match the _id in the database)
        const updatedVehicle = await VehicleInstance.findOneAndUpdate(
            { _id: vehicleID }, // Match the _id with vehicleID
            {
                vehicleSeat,
                vehicleTransmission,
                vehicleFuelType,
                vehiclePic: uploadedPicUrl,
                vehicleRegNumber,
                manufacturingYear,
                pricePerDay,
                pricePerHour,
                availabilityStatus
            },
            { new: true } // This option returns the updated document
        ).populate('modelID')

        if (!updatedVehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        // Return the updated vehicle details
        res.status(200).json({
            vehicleDetails: updatedVehicle,
        });
    } catch (error) {
        console.error('Error updating vehicle data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteVehicleData = async (req, res) => {
    try {
        const { vehicleID } = req.body;

        // Fetch vehicle instance
        const vehicle = await VehicleInstance.findById(vehicleID);
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle instance not found" });
        }

        // Delete the vehicle's image from Cloudinary if it exists
        if (vehicle.vehiclePic) {
            const publicId = getFileNameFromUrl(vehicle.vehiclePic);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
                } catch (cloudinaryError) {
                    console.warn("Failed to delete vehicle image from Cloudinary:", cloudinaryError);
                }
            }
        }

        // Delete all update requests related to the vehicle
        await VehicleUpdateRequest.deleteMany({ vehicleId: vehicleID });

        // Delete the vehicle instance
        const deletedVehicle = await VehicleInstance.findByIdAndDelete(vehicleID);
        if (!deletedVehicle) {
            return res.status(500).json({ error: "Failed to delete vehicle instance" });
        }

        // Respond with success message
        res.status(200).json({
            message: "Vehicle instance and all associated update requests deleted successfully",
            deletedVehicle,
        });
    } catch (error) {
        console.error("Error deleting vehicle instance:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const totalVehicleModel = async (req, res) => {
    try {
        // Fetch all vehicle models
        const vehicleModels = await VehicleModel.find({});

        // Count the models
        const totalVehicleModels = vehicleModels.length;

        res.status(200).json({
            totalVehicleModels,
            vehicleModelDetails: vehicleModels,
        });
    } catch (error) {
        console.error('Error fetching vehicle models:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteModelData = async (req, res) => {
    try {
        const { modelID } = req.body;

        // Validate modelID
        if (!modelID) {
            return res.status(400).json({ message: "Model ID is required" });
        }

        // Check if any vehicle instance exists with the given model ID
        const vehicleInstances = await VehicleInstance.find({ modelID });

        if (vehicleInstances.length > 0) {
            return res.status(400).json({
                message: "Cannot delete this model because there are vehicle instances referencing it.",
            });
        }

        // Find the model before deletion
        const model = await VehicleModel.findById(modelID);
        if (!model) {
            return res.status(404).json({ message: "Vehicle model not found" });
        }

        // Delete associated image from Cloudinary if it exists
        if (model.modelPic) {
            const publicId = getFileNameFromUrl(model.modelPic);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
            }
        }

        // Delete the model from the database
        const deletedModel = await VehicleModel.findByIdAndDelete(modelID);
        if (!deletedModel) {
            return res.status(404).json({ message: "Vehicle model not found" });
        }

        // Return success response
        return res.status(200).json({
            message: "Vehicle model deleted successfully",
            deletedModel,
        });
    } catch (error) {
        console.error("Error deleting vehicle model:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const vehicelupdaterequest = async (req, res) => {
    try {
        const {
            requestId,
            vehicleId,
            requestedBy,
            requestMessage,
            status,
            requestType,
        } = req.body;

        if (
            !vehicleId ||
            !requestedBy ||
            !requestMessage ||
            !status ||
            !requestType
        ) {
            return res.status(400).json({ message: "All details are required" });
        }

        const vehicle = await VehicleInstance.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle instance not found" });
        }

        // If requestId exists, update the existing request
        if (requestId) {
            const existingRequest = await VehicleUpdateRequest.findById(requestId);
            if (!existingRequest) {
                return res.status(404).json({ error: "Update request not found" });
            }

            // Update fields of the existing request
            existingRequest.requestedBy = requestedBy;
            existingRequest.requestMessage = requestMessage;
            existingRequest.status = status;
            existingRequest.requestType = requestType;

            // Save the updated request
            await existingRequest.save();

            // Optional: You can also update the vehicle status if necessary
            vehicle.availabilityStatus = "Unavailable";
            await vehicle.save();

            const populatedUpdateRequest = await existingRequest.populate('vehicleId');

            return res.status(200).json({
                message: "Vehicle Update Request updated successfully",
                success: true,
                UpdateRequest: populatedUpdateRequest,
            });
        } else {
            // If no requestId, create a new update request
            const newUpdateRequest = new VehicleUpdateRequest({
                vehicleId: vehicleId,
                requestedBy,
                requestMessage,
                status,
                requestType,
            });

            await newUpdateRequest.save();

            vehicle.availabilityStatus = "Unavailable";
            await vehicle.save();

            const populatedUpdateRequest = await newUpdateRequest.populate('vehicleId');

            return res.status(201).json({
                message: "Vehicle Update Request sent successfully",
                success: true,
                UpdateRequest: populatedUpdateRequest,
            });
        }
    } catch (error) {
        console.error("Error sending Vehicle Update Request: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const vehicleDeleteRequest = async (req, res) => {
    try {
        const { requestID } = req.body;

        if (!requestID) {
            return res.status(400).json({ message: "Request ID is required" });
        }

        const request = await VehicleUpdateRequest.findOne({ _id: requestID });

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const vehicleID = request.vehicleId;

        const deletedRequest = await VehicleUpdateRequest.findOneAndDelete({ _id: requestID });

        if (!deletedRequest) {
            return res.status(404).json({ message: "Failed to delete request" });
        }

        const pendingOrReviewRequests = await VehicleUpdateRequest.countDocuments({
            vehicleId: vehicleID,
            status: { $in: ["pending", "review"] },
        });

        if (pendingOrReviewRequests === 0) {
            await VehicleInstance.findByIdAndUpdate(vehicleID, { availabilityStatus: "Available" });
        }
        return res.status(200).json({
            success: true,
            message: "Request deleted successfully",
            deletedRequest,
        });
    } catch (error) {
        console.error("Error deleting request:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const vehicelPendingUpdateRequestData = async (req, res) => {
    try {


        const totalUpdateRequestData = await VehicleUpdateRequest.find()
            .populate({
                path: "vehicleId",
                select: "vehicleRegNumber vehiclePic owner",
            })
            .populate({
                path: "requestedBy",
                select: "email",
                populate: {
                    path: "roleId",
                    select: "roleName",
                },
            });

        // Send response
        res.status(200).json({
            totalUpdateRequest: totalUpdateRequestData.length,
            totalUpdateResponce: totalUpdateRequestData,
        });

    } catch (error) {
        console.error("Error fetching vehicle update request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateRequestStatus = async (req, res) => {
    try {
        const { requestID, status, vehicleID } = req.body;
        if (!requestID || !status || !vehicleID) {
            return res.status(400).json({ success: false, message: "Missing required request fields" });
        }

        // Update the request status
        const updatedRequest = await VehicleUpdateRequest.findOneAndUpdate(
            { _id: requestID },
            { status },
            { new: true } // Returns the updated document
        );

        if (!updatedRequest) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }
        // Find the vehicle
        const vehicle = await VehicleInstance.findById(vehicleID);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }
        // Check for existing requests with "pending" or "review" status for the same vehicle
        const existingRequests = await VehicleUpdateRequest.find({
            vehicleId: vehicleID,
            status: { $in: ["pending", "review"] }
        });

        // If there are existing requests in "pending" or "review", prevent setting the vehicle as "Available"
        if (existingRequests.length > 0) {
            if (status === "approve") {
                vehicle.availabilityStatus = "Unavailable";
            }
        } else {
            // If there are no pending/review requests, we can set the vehicle as "Available" for approved requests
            if (status === "approve") {
                vehicle.availabilityStatus = "Available";
            }
        }

        // For other status types (pending, review), set the vehicle availability as "Unavailable"
        const statusMapping = {
            pending: "Unavailable",
            review: "Unavailable",
        };

        // Ensure we don't overwrite the "approve" logic if we already set the availability
        if (status !== "approve" && statusMapping[status]) {
            vehicle.availabilityStatus = statusMapping[status];
        }

        // Save vehicle status update
        await vehicle.save(); // Save only once
        return res.status(200).json({
            success: true,
            message: "Request status updated successfully",
            updatedRequest,
            vehicle,
        });

    } catch (error) {
        console.error("Error updating request status:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const acceptRequest = async (req, res) => {
    try {
        const { requestID } = req.body;

        if (!requestID) {
            return res.status(400).json({ message: "Request ID is required" });
        }

        const request = await VehicleUpdateRequest.findOne({ _id: requestID });

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const vehicleID = request.vehicleId;

        const deletedRequest = await VehicleUpdateRequest.findOneAndDelete({ _id: requestID });

        if (!deletedRequest) {
            return res.status(404).json({ message: "Failed to delete request" });
        }

        const pendingOrReviewRequests = await VehicleUpdateRequest.countDocuments({
            vehicleId: vehicleID,
            status: { $in: ["pending", "review"] },
        });

        if (pendingOrReviewRequests === 0) {
            await VehicleInstance.findByIdAndUpdate(vehicleID, { availabilityStatus: "Available" });
        }
        return res.status(200).json({
            success: true,
            message: "Request deleted successfully",
            deletedRequest,
        });
    } catch (error) {
        console.error("Error deleting request:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
