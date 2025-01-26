import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import VehicleInstance from "../models/vehicleInstance.model.js";
import VehicleModel from "../models/vehicleModel.model.js";
import { getFileNameFromUrl } from "../lib/utils.js";


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
            transformation: [{ width: 800, height: 800, crop: "limit" }]
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

        const vehicle = await VehicleInstance.findById(vehicleID);
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle instance not found" });
        }

        // If vehicle has an image, delete it from Cloudinary
        if (vehicle.vehiclePic) {
            const publicId = getFileNameFromUrl(vehicle.vehiclePic);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
            }
        }


        // Find and delete the specific vehicle instance using vehicleID directly
        const deletedVehicle = await VehicleInstance.findByIdAndDelete(vehicleID);

        // Check if the vehicle instance was found and deleted
        if (!deletedVehicle) {
            return res.status(404).json({ error: "Vehicle instance not found" });
        }

        // Respond with success message
        res.status(200).json({
            message: "Vehicle instance deleted successfully",
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



