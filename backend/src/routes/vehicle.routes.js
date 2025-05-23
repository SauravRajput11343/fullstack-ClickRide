import express from "express"
import { addVehicle, updateModelPic, totalVehicle, totalVehicleModel, vehicleData, updateVehicleData, deleteVehicleData, deleteModelData, vehicelupdaterequest, vehicelPendingUpdateRequestData, updateRequestStatus, vehicleDeleteRequest, bookingVehicle, getVehicleHistory, cancelBooking} from "../controllers/vehicle.controller.js"
const router = express.Router()

router.post("/addVehicle", addVehicle)
router.put("/updateModelPic", updateModelPic)
router.post("/DeleteModel", deleteModelData)
router.get("/vehicles", totalVehicle)
router.get("/vehicles/:id", vehicleData)
router.post("/updatevehicle", updateVehicleData)
router.post("/deleteVehicle", deleteVehicleData)
router.get("/vehiclesModel", totalVehicleModel)
router.post("/vehicleUpdateRequest", vehicelupdaterequest)
router.get("/vehicelPendingUpdateRequestData", vehicelPendingUpdateRequestData)
router.post("/updateRequestStatus", updateRequestStatus)
router.post("/vehicleDeleteRequest", vehicleDeleteRequest)
router.post("/bookingVehicle", bookingVehicle)
router.post("/viewHistory", getVehicleHistory)
router.post("/cancelBooking", cancelBooking)

export default router;