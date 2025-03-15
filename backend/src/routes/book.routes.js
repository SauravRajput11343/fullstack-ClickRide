import express from "express"
import { setbookmark, unsetbookmark, checkBookmark, fetchAllBookmarks, verifyRide, UnverifyRide, checkBookStatus } from "../controllers/book.controller.js";

const router = express.Router()

router.post("/setBookmark", setbookmark);
router.post("/unsetBookmark", unsetbookmark)
router.post("/checkBookmark", checkBookmark)
router.post("/fetchAllBookmarks", fetchAllBookmarks)

router.post("/verifyRide", verifyRide)
router.post("/UnverifyRide", UnverifyRide)
router.post("/checkBookStatus", checkBookStatus)
export default router;