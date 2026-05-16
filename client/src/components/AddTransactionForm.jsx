import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addTransaction, fetchTransactions } from "../store/transactionSlice";
import AutocompleteInput from "./AutocompleteInput";

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
  "bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 w-full outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition";

const initialForm = {
  type: "expense",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  reason: "",
  category: "Food",
  note: ""
};

const AddTransactionForm = () => {
  const dispatch = useDispatch();
  const defaultCategory = useSelector(
    (state) => state.auth.user?.settings?.defaultCategory || initialForm.category
  );
  const [form, setForm] = useState({ ...initialForm, category: defaultCategory });

  useEffect(() => {
    setForm((current) => ({
      ...current,
      category: current.category || defaultCategory
    }));
  }, [defaultCategory]);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(
      addTransaction({
        ...form,
        amount: Number(form.amount)
      })
    );

    if (addTransaction.fulfilled.match(result)) {
      toast.success("Transaction added");
      setForm({
        ...initialForm,
        type: form.type,
        category: defaultCategory,
        date: new Date().toISOString().slice(0, 10)
      });
      dispatch(fetchTransactions());
    } else {
      toast.error(result.payload || "Unable to add transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="mb-4 text-sm font-medium text-gray-900">Add Transaction</h3>

      <div className="flex flex-col gap-4">
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {["income", "expense"].map((type) => (
            <button
              key={type}
              type="button"
              className={`flex-1 rounded-md px-4 py-2 text-sm capitalize transition ${
                form.type === type
                  ? "bg-white font-medium text-indigo-600 shadow-sm"
                  : "cursor-pointer text-gray-500"
              }`}
              onClick={() => updateField("type", type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
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

        <AutocompleteInput
          value={form.reason}
          onChange={(value) => updateField("reason", value)}
          placeholder="Reason"
        />

        <div className="flex flex-col gap-4 sm:flex-row">
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

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
