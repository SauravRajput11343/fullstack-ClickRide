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
        enum: ["Update", "Delete", "Report"]
    }
}, {
    timestamps: true
});

const VehicleUpdateRequest = mongoose.model("VehicleUpdateRequest", vehicleUpdateRequestSchema);

export default VehicleUpdateRequest;
