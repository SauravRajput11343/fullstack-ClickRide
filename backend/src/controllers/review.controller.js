import { reviewSchema, editReviewSchema, deleteReviewSchema, fetchReviewSchema } from "../validators/review.validator.js";
import VehicleRating from "../models/vehicleRating.model.js";
import User from "../models/user.model.js"
import * as Yup from 'yup';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
export const addReview = async (req, res) => {
    const {
        vehicleId,
        rating,
        reviewText
    } = req.body;

    const userId = req.user._id;
    try {
        await reviewSchema.validate(
            { vehicleId, userId, rating, reviewText },
            { abortEarly: false }
        );

        const newReview = new VehicleRating({
            vehicleId,
            userId,
            rating,
            reviewText,
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        if (error instanceof Yup.ValidationError) {
            // Handle Yup validation errors
            return res.status(400).json({ errors: error.errors });
        } else {

            console.error('Error adding review:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const editReview = async (req, res) => {
    const {
        reviewId,
        rating,
        reviewText
    } = req.body;

    const userId = req.user._id;
    const userIdObjectId = new ObjectId(userId);

    try {
        await editReviewSchema.validate({ reviewId, rating, reviewText }, { abortEarly: false });
        const review = await VehicleRating.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!review.userId.equals(userIdObjectId)) {
            return res.status(403).json({ message: 'You are not authorized to edit this review' });
        }


        // Update the review fields if provided
        if (rating !== undefined) {
            review.rating = rating;
        }
        if (reviewText !== undefined) {
            review.reviewText = reviewText;
        }

        const updatedReview = await review.save();
        res.status(200).json(updatedReview);
    } catch (error) {
        if (error instanceof Yup.ValidationError) {

            return res.status(400).json({ errors: error.errors });
        } else {

            console.error('Error editing review:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const deleteReview = async (req, res) => {
    const {
        reviewId
    } = req.body;
    const userId = req.user._id;
    const userIdObjectId = new ObjectId(userId);
    try {

        await deleteReviewSchema.validate({ reviewId }, { abortEarly: false });

        const review = await VehicleRating.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (!review.userId.equals(userIdObjectId)) {
            return res.status(403).json({ message: 'You are not authorized to delete this review' });
        }

        await VehicleRating.findByIdAndDelete(reviewId);


        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        if (error instanceof Yup.ValidationError) {
            // Handle Yup validation errors
            return res.status(400).json({ errors: error.errors });
        } else {
            // Handle other errors (e.g., database errors)
            console.error('Error deleting review:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const fetchReview = async (req, res) => {
    const {
        vehicleId
    } = req.body;

    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await fetchReviewSchema.validate({ vehicleId }, { abortEarly: false });

        const query = { vehicleId: new ObjectId(vehicleId) };

        const reviews = await VehicleRating.find(query)
            .populate('userId', 'username email profilePic firstName lastName');
        res.status(200).json(reviews);
    } catch (error) {
        if (error instanceof Yup.ValidationError) {
            return res.status(400).json({ errors: error.errors });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const vehicleRating = async (req, res) => {
    try {
        await fetchReviewSchema.validate(req.body, { abortEarly: false });

        const vehicleId = new ObjectId(req.body.vehicleId);

        const [ratingData] = await VehicleRating.aggregate([
            { $match: { vehicleId } },
            {
                $group: {
                    _id: "$vehicleId",
                    avgRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            avgRating: ratingData?.avgRating?.toFixed(1) || "0.0",
            totalReviews: ratingData?.totalReviews || 0,
        });
    } catch (error) {
        res.status(error instanceof Yup.ValidationError ? 400 : 500).json({
            message: error instanceof Yup.ValidationError ? error.errors : "Internal server error",
        });
    }
};