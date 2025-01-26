import express from "express"
import { signup, totalUser } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/auth.controller.js";
import { checkAuth } from "../controllers/auth.controller.js";
import { addPreDefinedRole } from "../controllers/role.controller.js";
import { updatePassword } from "../controllers/auth.controller.js";

const router = express.Router()

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/updateProfile", protectRoute, updateProfile)
router.get("/check", protectRoute, checkAuth)
router.post("/role", addPreDefinedRole);
router.get("/users", totalUser)
router.post("/updatePassword", protectRoute, updatePassword)

export default router;