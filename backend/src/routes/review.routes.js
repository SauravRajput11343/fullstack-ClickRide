import express from "express"
import { addReview, editReview, deleteReview, fetchReview, vehicleRating } from "../controllers/review.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

router.post("/addReview", protectRoute, addReview);
router.post("/editReview", protectRoute, editReview);
router.post("/deleteReview", protectRoute, deleteReview);
router.post("/fetchReview", protectRoute, fetchReview);
router.post("/vehicleRating", vehicleRating);


export default router;