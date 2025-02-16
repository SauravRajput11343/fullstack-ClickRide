import mongoose from "mongoose";

const vehicleLocationSchema = mongoose.Schema({
    vehicleAddress: {
        type: String,
        required: true,  // Assuming this is a required field
        default: "",
    },
    city: {
        type: String,
        required: true,  // Assuming this is a required field
        default: "",
    },
    state: {
        type: String,
        required: true,  // Assuming this is a required field
        default: "",
    },
    country: {
        type: String,
        required: true,  // Assuming this is a required field
        default: "",
    },
    pincode: {
        type: String,
        required: true,  // Assuming this is a required field
        default: "",
    },
    latitude: {
        type: Number,
        required: true,  // Assuming this is a required field
        default: 0,
    },
    longitude: {
        type: Number,
        required: true,  // Assuming this is a required field
        default: 0,
    },
}, {
    timestamps: true,
});

const VehicleLocation = mongoose.model("VehicleLocation", vehicleLocationSchema);

export default VehicleLocation;
