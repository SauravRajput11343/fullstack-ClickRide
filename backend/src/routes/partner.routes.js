import express from "express"

import { partnerSignup } from "../controllers/partner.controller.js";
import { partnerRequest } from "../controllers/partner.controller.js";

const router = express.Router()

router.post("/partnerSignup", partnerSignup)
router.get("/partnerRequest", partnerRequest)
export default router;