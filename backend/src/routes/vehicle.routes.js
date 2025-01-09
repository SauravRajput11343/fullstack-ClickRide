import express from "express"
import { addVehicle, updateVehiclePic, totalVehicle, totalVehicleModel, vehicleData, updateVehicleData, deleteVehicleData } from "../controllers/vehicle.controller.js"
const router = express.Router()

router.post("/addVehicle", addVehicle)
router.put("/addVehiclePic", updateVehiclePic)
router.get("/vehicles", totalVehicle)
router.get("/vehicles/:id", vehicleData)
router.post("/updatevehicle", updateVehicleData)
router.post("/deleteVehicle", deleteVehicleData)
router.get("/vehiclesModel", totalVehicleModel)
export default router;