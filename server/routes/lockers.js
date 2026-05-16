import express from "express";
import {
  createLocker,
  deleteLocker,
  getLockerSummary,
  listLockers,
  moveLockerAmount,
  updateLocker
} from "../controllers/lockerController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(listLockers).post(createLocker);
router.get("/summary", getLockerSummary);
router.route("/:id").patch(updateLocker).delete(deleteLocker);
router.post("/:id/move", moveLockerAmount);

export default router;
