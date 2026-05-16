import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummary,
  listTransactions,
  updateTransaction
} from "../controllers/transactionController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(listTransactions).post(createTransaction);
router.get("/summary", getSummary);
router.route("/:id").patch(updateTransaction).delete(deleteTransaction);

export default router;
