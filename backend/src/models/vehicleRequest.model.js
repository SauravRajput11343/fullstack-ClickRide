import mongoose from "mongoose";

const vehicleUpdateRequestSchema = mongoose.Schema({
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VehicleInstance",
        required: true,
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    requestMessage: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "review"],
        default: "pending",
    },
    requestType: {
        type: String,
        enum: ["Update", "Delete", "Report","Add"]
    }
}, {
    timestamps: true
});

const VehicleRequest = mongoose.model("VehicleRequest", vehicleUpdateRequestSchema);

export default VehicleRequest;
