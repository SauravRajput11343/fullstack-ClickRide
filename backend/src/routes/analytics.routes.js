import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";

import { getBookingStats, getRevenueStats, getVehicleStats, getAdminAnalytics, getPartnerAnalytics } from "../controllers/analytics.controller.js"
const router = express.Router()

router.get("/booking-stats", getBookingStats)
// router.get("/revenue-stats", getRevenueStats)
// router.get("/vehicle-stats", getVehicleStats)

router.get("/getAdminAnalytics", getAdminAnalytics)
router.get("/getPartnerAnalytics", protectRoute, getPartnerAnalytics)


export default router;