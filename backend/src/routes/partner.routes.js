import express from "express"

import { partnerSignup, validatePartnerRequest } from "../controllers/partner.controller.js";
import { partnerRequest } from "../controllers/partner.controller.js";
import { deletePartnerRequest } from "../controllers/partner.controller.js";

const router = express.Router()

router.post("/partnerSignup", partnerSignup)
router.get("/partnerRequest", partnerRequest)
router.post("/deletePartnerRequest", deletePartnerRequest)
router.post("/validatePartnerRequest", validatePartnerRequest)
export default router;