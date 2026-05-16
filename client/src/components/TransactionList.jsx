import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  deleteTransaction,
  fetchSummary,
  fetchTransactions,
  setFilter,
  updateTransaction
} from "../store/transactionSlice";
import EditTransactionModal from "./EditTransactionModal";
import TransactionItem from "./TransactionItem";

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

const selectClasses = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none sm:w-auto";

const TransactionList = () => {
  const dispatch = useDispatch();
  const { items, filters, status } = useSelector((state) => state.transactions);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const updateFilter = (key, value) => {
    dispatch(setFilter({ key, value }));
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteTransaction(id));

    if (deleteTransaction.fulfilled.match(result)) {
      toast.success("Deleted");
      dispatch(fetchSummary());
    } else {
      toast.error(result.payload?.message || "Unable to delete transaction");
      dispatch(fetchTransactions());
    }
  };

  const handleSave = async (id, updates) => {
    const result = await dispatch(updateTransaction({ id, updates }));

    if (updateTransaction.fulfilled.match(result)) {
      toast.success("Transaction updated");
      setEditingTransaction(null);
      dispatch(fetchTransactions());
    } else {
      toast.error(result.payload || "Unable to update transaction");
    }
  };

  return (
    <>
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-sm font-medium text-gray-900">Transactions</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
          <input
            className={selectClasses}
            type="month"
            value={filters.month}
            onChange={(event) => updateFilter("month", event.target.value)}
          />
          <select
            className={selectClasses}
            value={filters.type}
            onChange={(event) => updateFilter("type", event.target.value)}
          >
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            className={selectClasses}
            value={filters.category}
            onChange={(event) => updateFilter("category", event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {items.length > 0 ? (
          items.map((transaction) => (
            <TransactionItem
              key={transaction._id}
              transaction={transaction}
              onEdit={setEditingTransaction}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-400">
            {status === "loading" ? "Loading transactions..." : "No transactions found"}
          </div>
        )}
      </div>
    </div>
    <EditTransactionModal
      transaction={editingTransaction}
      onClose={() => setEditingTransaction(null)}
      onSave={handleSave}
    />
    </>
  );
};

export default TransactionList;
