import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    vehicleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VehicleInstance",
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    accessories: {
        type: [String], // List of selected accessories
        default: []
    },
    totalPrice: {
        type: Number,
        required: true
    },
    otp: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
