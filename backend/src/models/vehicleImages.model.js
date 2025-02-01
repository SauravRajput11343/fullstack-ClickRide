import mongoose from "mongoose";

const vehicleImagesSchema = mongoose.Schema({


    VehicleFrontPic: {
        type: String, // Default model picture
        required: false,
        default: "",
    },
    VehicleBackPic: {
        type: String, // Default model picture
        required: false,
        default: "",
    },
    VehicleSide1Pic: {
        type: String, // Default model picture
        required: false,
        default: "",
    },
    VehicleSide2Pic: {
        type: String, // Default model picture
        required: false,
        default: "",
    },
}, {
    timestamps: true
});

const VehicleImages = mongoose.model("VehicleImages", vehicleImagesSchema);

export default VehicleImages;
