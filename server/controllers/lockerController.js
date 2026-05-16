import Locker from "../models/Locker.js";

export const listLockers = async (req, res, next) => {
  try {
    const lockers = await Locker.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(lockers);
  } catch (error) {
    next(error);
  }
};

export const createLocker = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount || 0);
    const locker = await Locker.create({
      user: req.user._id,
      name: req.body.name,
      amount,
      note: req.body.note || "",
      movements:
        amount > 0
          ? [
              {
                type: "credit",
                amount,
                note: "Opening balance"
              }
            ]
          : []
    });

    res.status(201).json(locker);
  } catch (error) {
    next(error);
  }
};

export const updateLocker = async (req, res, next) => {
  try {
    const locker = await Locker.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        name: req.body.name,
        note: req.body.note || ""
      },
      { new: true, runValidators: true }
    );

    if (!locker) {
      res.status(404);
      throw new Error("Locker not found");
    }

    res.json(locker);
  } catch (error) {
    next(error);
  }
};

export const deleteLocker = async (req, res, next) => {
  try {
    const locker = await Locker.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!locker) {
      res.status(404);
      throw new Error("Locker not found");
    }

    res.json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

export const moveLockerAmount = async (req, res, next) => {
  try {
    const { type, note } = req.body;
    const amount = Number(req.body.amount);

    if (!["credit", "debit"].includes(type)) {
      res.status(400);
      throw new Error("Movement type must be credit or debit");
    }

    if (!amount || amount <= 0) {
      res.status(400);
      throw new Error("Amount must be greater than zero");
    }

    const locker = await Locker.findOne({ _id: req.params.id, user: req.user._id });

    if (!locker) {
      res.status(404);
      throw new Error("Locker not found");
    }

    if (type === "debit" && locker.amount < amount) {
      res.status(400);
      throw new Error("Locker does not have enough balance");
    }

    locker.amount = type === "credit" ? locker.amount + amount : locker.amount - amount;
    locker.movements.unshift({ type, amount, note: note || "" });
    await locker.save();

    res.json(locker);
  } catch (error) {
    next(error);
  }
};

export const getLockerSummary = async (req, res, next) => {
  try {
    const lockers = await Locker.find({ user: req.user._id });
    const total = lockers.reduce((sum, locker) => sum + locker.amount, 0);
    const movementTotals = lockers.reduce(
      (totals, locker) => {
        locker.movements.forEach((movement) => {
          totals[movement.type] += movement.amount;
        });
        return totals;
      },
      { credit: 0, debit: 0 }
    );

    res.json({
      total,
      count: lockers.length,
      credit: movementTotals.credit,
      debit: movementTotals.debit,
      breakdown: lockers.map((locker) => ({
        id: locker._id,
        name: locker.name,
        amount: locker.amount,
        note: locker.note
      }))
    });
  } catch (error) {
    next(error);
  }
};
