import Suggestion from "../models/Suggestion.js";

export const getSuggestions = async (req, res, next) => {
  try {
    const query = (req.query.q || "").trim();

    if (!query) {
      return res.json([]);
    }

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const suggestions = await Suggestion.find({
      user: req.user._id,
      text: { $regex: escapedQuery, $options: "i" }
    })
      .sort({ useCount: -1, text: 1 })
      .limit(5);

    res.json(suggestions);
  } catch (error) {
    next(error);
  }
};

export const saveSuggestion = async (req, res, next) => {
  try {
    const text = (req.body.text || "").trim();

    if (!text) {
      res.status(400);
      throw new Error("Suggestion text is required");
    }

    const suggestion = await Suggestion.findOneAndUpdate(
      { user: req.user._id, text },
      { $inc: { useCount: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(suggestion);
  } catch (error) {
    next(error);
  }
};
