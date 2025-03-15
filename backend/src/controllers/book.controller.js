import Bookmark from "../models/bookmark.model.js";
import VehicleInstance from "../models/vehicleInstance.model.js";
import { BookmarkSchema } from "../validators/booking.vaildator.js";
import Booking from "../models/booking.model.js";

// Set Bookmark
export const setbookmark = async (req, res) => {
    try {
        await BookmarkSchema.validate(req.body);

        const {
            userId,
            vehicleId
        } = req.body;

        // Check if the vehicle exists
        const vehicle = await VehicleInstance.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }

        // Check if already bookmarked
        const existingBookmark = await Bookmark.findOne({ userId, vehicleId });
        if (existingBookmark) {
            return res.status(400).json({ success: false, message: "Vehicle already bookmarked" });
        }

        // Create new bookmark
        const newBookmark = new Bookmark({ userId, vehicleId });
        await newBookmark.save();

        return res.status(201).json({ success: true, message: "Bookmark added successfully", bookmark: newBookmark });
    } catch (error) {
        console.error("Error setting bookmark:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const unsetbookmark = async (req, res) => {
    try {
        await BookmarkSchema.validate(req.body); // Validate request

        const {
            userId,
            vehicleId
        } = req.body;

        // Check if bookmark exists
        const bookmark = await Bookmark.findOne({ userId, vehicleId });
        if (!bookmark) {
            return res.status(404).json({ success: false, message: "Bookmark not found" });
        }

        // Remove bookmark
        await Bookmark.deleteOne({ userId, vehicleId });

        return res.status(200).json({ success: true, message: "Bookmark removed successfully" });
    } catch (error) {
        console.error("Error unsetting bookmark:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const checkBookmark = async (req, res) => {
    try {
        await BookmarkSchema.validate(req.body);
        const {
            userId,
            vehicleId
        } = req.body;

        const bookmark = await Bookmark.findOne({ userId, vehicleId });
        return res.status(200).json({ isBookmarked: !!bookmark });
    } catch (error) {
        console.error("Error checking bookmark:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const fetchAllBookmarks = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch bookmarks with populated vehicle details, including model and images
        const bookmarks = await Bookmark.find({ userId })
            .populate({
                path: "vehicleId",
                populate: [
                    { path: "modelID" },  // Populating model details
                    { path: "vehicleImagesId" } // Populating vehicle images
                ]
            });

        return res.status(200).json({ bookmarks });
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyRide = async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ message: "Booking ID is required" });
        }

        // Fetch the current booking to check its status
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if the status is already 'Active'
        if (booking.status === "Active") {
            return res.status(200).json({ message: "Booking is already active", booking });
        }

        // Update status to 'Active'
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: "Active" },
            { new: true } // Returns the updated document
        );

        res.status(200).json({ message: "Booking activated successfully", booking: updatedBooking });
    } catch (error) {
        console.error("Error verifying ride:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const UnverifyRide = async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ message: "Booking ID is required" });
        }

        // Fetch the current booking to check its status
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if the status is 'Active' before updating it to 'Booked'
        if (booking.status !== "Active") {
            return res.status(400).json({ message: "Booking status must be 'Active' to change to 'Booked'" });
        }

        // Update status to 'Booked'
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: "Booked" },
            { new: true } // Returns the updated document
        );

        res.status(200).json({ message: "Booking HandOver cancelled", booking: updatedBooking });
    } catch (error) {
        console.error("Error updating ride status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const checkBookStatus = async (req, res) => {
    try {
        const {
            bookingId
        } = req.body;

        if (!bookingId) {
            return res.status(400).json({ message: "Booking ID is required" });
        }

        // Fetch the current booking to check its status
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Send the current booking status to the frontend
        return res.status(200).json({ status: booking.status });

    } catch (error) {
        console.error("Error retrieving booking status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
