import Transaction from "../models/Transaction.js";

const getMonthBounds = (month) => {
  if (!month) return {};

  const [year, monthNumber] = month.split("-").map(Number);
  if (!year || !monthNumber) return {};

  const start = new Date(Date.UTC(year, monthNumber - 1, 1));
  const end = new Date(Date.UTC(year, monthNumber, 1));

  return { date: { $gte: start, $lt: end } };
};

const buildFilters = (query, userId) => {
  const filters = { user: userId, ...getMonthBounds(query.month) };

  if (query.type) filters.type = query.type;
  if (query.category) filters.category = query.category;

  return filters;
};

export const createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create({ ...req.body, user: req.user._id });
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const listTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find(buildFilters(req.query, req.user._id)).sort({
      date: -1,
      createdAt: -1
    });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    res.json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const summary = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$date" } },
            category: "$category"
          },
          total: { $sum: "$amount" },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
            }
          }
        }
      },
      {
        $group: {
          _id: "$_id.month",
          breakdown: {
            $push: {
              category: "$_id.category",
              total: "$total",
              income: "$income",
              expense: "$expense"
            }
          },
          income: { $sum: "$income" },
          expense: { $sum: "$expense" }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          breakdown: 1,
          income: 1,
          expense: 1
        }
      },
      { $sort: { month: 1 } }
    ]);

    res.json(summary);
  } catch (error) {
    next(error);
  }
};
