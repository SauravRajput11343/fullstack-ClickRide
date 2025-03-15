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
    startDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
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
    status: {
        type: String,
        enum: ["Booked", "Done", "Cancelled", "Active"],
        default: "Booked",
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
