import mongoose from "mongoose";

const vehicleInstanceSchema = mongoose.Schema({
    modelID: {
        type: mongoose.Schema.Types.ObjectId, // Reference to VehicleModel
        ref: "VehicleModel",
        required: true,
    },
    vehicleRegNumber: {
        type: String,
        required: true,
        unique: true, // Ensures unique registration numbers
    },
    manufacturingYear: {
        type: Number,
        required: true,
    }, vehicleSeat: {
        type: String,
        required: true,
    },
    vehicleTransmission: {
        type: String,
        required: true,
    },
    vehicleFuelType: {
        type: String,
        required: true,
    },
    pricePerDay: {
        type: mongoose.Schema.Types.Decimal128, // Correcting Decimal type
        required: true,
    },
    pricePerHour: {
        type: mongoose.Schema.Types.Decimal128, // Correcting Decimal type
        required: true,
    },
    availabilityStatus: {
        type: String,
        enum: ["Available", "Booked", "Unavailable"], // Restrict to predefined values
        default: "Available",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    vehicleImagesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VehicleImages",
        required: true,
    },
    vehicleLocationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VehicleLocation",
        required: true,
    }
}, {
    timestamps: true
});

const VehicleInstance = mongoose.model("VehicleInstance", vehicleInstanceSchema);

export default VehicleInstance;
