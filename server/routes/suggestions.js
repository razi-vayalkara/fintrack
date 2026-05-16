import express from "express";
import { getSuggestions, saveSuggestion } from "../controllers/suggestionController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getSuggestions).post(saveSuggestion);

export default router;
