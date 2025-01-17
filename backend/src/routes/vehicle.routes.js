import express from "express"
import { addVehicle, updateModelPic, totalVehicle, totalVehicleModel, vehicleData, updateVehicleData, deleteVehicleData, deleteModelData } from "../controllers/vehicle.controller.js"
const router = express.Router()

router.post("/addVehicle", addVehicle)
router.put("/updateModelPic", updateModelPic)
router.post("/DeleteModel", deleteModelData)
router.get("/vehicles", totalVehicle)
router.get("/vehicles/:id", vehicleData)
router.post("/updatevehicle", updateVehicleData)
router.post("/deleteVehicle", deleteVehicleData)
router.get("/vehiclesModel", totalVehicleModel)
export default router;