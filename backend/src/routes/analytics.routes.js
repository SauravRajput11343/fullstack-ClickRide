import express from "express"
import { getBookingStats, getRevenueStats, getVehicleStats, getAdminAnalytics } from "../controllers/analytics.controller.js"
const router = express.Router()

router.get("/booking-stats", getBookingStats)
// router.get("/revenue-stats", getRevenueStats)
// router.get("/vehicle-stats", getVehicleStats)

router.get("/getAdminAnalytics", getAdminAnalytics)

export default router;