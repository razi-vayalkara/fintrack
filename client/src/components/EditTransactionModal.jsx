import { useEffect, useState } from "react";
import { X } from "lucide-react";

const categories = [
  "Food",
  "Rent",
  "Transport",
  "Entertainment",
  "Health",
  "Shopping",
  "Salary",
  "Freelance",
  "Other"
];

const inputClasses =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const toDateInput = (date) => new Date(date).toISOString().slice(0, 10);

const EditTransactionModal = ({ transaction, onClose, onSave }) => {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    date: "",
    reason: "",
    category: "Other",
    note: ""
  });

  useEffect(() => {
    if (!transaction) return;

    setForm({
      type: transaction.type,
      amount: String(transaction.amount),
      date: toDateInput(transaction.date),
      reason: transaction.reason,
      category: transaction.category,
      note: transaction.note || ""
    });
  }, [transaction]);

  if (!transaction) return null;

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(transaction._id, {
      ...form,
      amount: Number(form.amount)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-gray-900/20 px-4 pb-4 sm:items-center sm:justify-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close edit transaction"
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Edit Transaction</h3>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            {["income", "expense"].map((type) => (
              <button
                key={type}
                type="button"
                className={`flex-1 rounded-md px-4 py-2 text-sm capitalize transition ${
                  form.type === type
                    ? "bg-white font-medium text-indigo-600 shadow-sm"
                    : "text-gray-500"
                }`}
                onClick={() => updateField("type", type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              className={inputClasses}
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(event) => updateField("amount", event.target.value)}
              placeholder="Amount"
              required
            />
            <input
              className={inputClasses}
              type="date"
              value={form.date}
              onChange={(event) => updateField("date", event.target.value)}
              required
            />
          </div>

          <input
            className={inputClasses}
            value={form.reason}
            onChange={(event) => updateField("reason", event.target.value)}
            placeholder="Reason"
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <select
              className={inputClasses}
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              className={inputClasses}
              value={form.note}
              onChange={(event) => updateField("note", event.target.value)}
              placeholder="Note"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditTransactionModal;
