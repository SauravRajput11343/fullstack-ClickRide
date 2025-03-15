import express from "express"
import { verifiedVehicle, cancelledVehicle, fetchAllVehicleRequest } from "../controllers/request.controller.js"
const router = express.Router()
router.post("/verifiedVehicle", verifiedVehicle)
router.post("/cancelledVehicle", cancelledVehicle)
router.get("/fetchAllVehicleRequest", fetchAllVehicleRequest)

export default router;