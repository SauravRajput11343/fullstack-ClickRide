import cron from "node-cron";
import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import VehicleInstance from "../models/vehicleInstance.model.js";

// Schedule the job to run every minute
cron.schedule("* * * * *", async () => {
    try {
        const currentDate = new Date();
      
        // Find all bookings where endDateTime has passed but the status is still "Booked" or "Active"
        const candidateBookings = await Booking.find({
            endDateTime: { $lte: currentDate },
            status: { $in: ["Booked", "Active"] }
        });

        for (const booking of candidateBookings) {
            console.log(`Processing booking ID: ${booking._id}, endDateTime: ${booking.endDateTime}`);

            // Update vehicle status to "Available"
            await VehicleInstance.findByIdAndUpdate(
                booking.vehicleID,
                { availabilityStatus: "Available" }
            );

            // Update booking status to "Completed"
            await Booking.findByIdAndUpdate(
                booking._id,
                { status: "Completed" }
            );

            console.log(`Booking ${booking._id} marked as Completed, vehicle ${booking.vehicleID} is now Available.`);
        }

    } catch (error) {
        console.error("Error updating vehicle and booking statuses:", error);
    }
});
