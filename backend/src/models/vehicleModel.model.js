import mongoose from "mongoose";

const vehicleModelSchema = mongoose.Schema({
    vehicleType: {
        type: String,
        required: true,
    },
    vehicleMake: {
        type: String,
        required: true,
    },
    vehicleModel: {
        type: String,
        required: true,
    },

    modelPic: {
        type: String, // Default model picture
        required: false,
        default: "",
    },
}, {
    timestamps: true
});

const VehicleModel = mongoose.model("VehicleModel", vehicleModelSchema);

export default VehicleModel;
