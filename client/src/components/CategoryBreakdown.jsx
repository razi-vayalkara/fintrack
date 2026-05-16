import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../store/transactionSlice";
import formatCurrency from "../utils/formatCurrency";

const barColors = {
  Food: "bg-amber-400",
  Rent: "bg-violet-400",
  Transport: "bg-blue-400",
  Entertainment: "bg-pink-400",
  Health: "bg-rose-400",
  Shopping: "bg-pink-400",
  Salary: "bg-emerald-400",
  Freelance: "bg-indigo-400",
  Other: "bg-gray-400"
};

const CategoryBreakdown = ({ transactions }) => {
  const dispatch = useDispatch();
  const month = useSelector((state) => state.transactions.filters.month);
  const currency = useSelector((state) => state.auth.user?.settings?.currency || "INR");

  const breakdown = Object.entries(
    transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((totals, transaction) => {
        totals[transaction.category] = (totals[transaction.category] || 0) + transaction.amount;
        return totals;
      }, {})
  )
    .map(([category, total]) => ({ category, total }))
    .sort((first, second) => second.total - first.total);

  const maxTotal = Math.max(...breakdown.map((item) => item.total), 0);

  const handleFilter = (category) => {
    dispatch(setFilters({ month, category, type: "" }));
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-medium text-gray-900">Category Breakdown</h3>

      <div className="flex flex-col gap-2">
        {breakdown.length > 0 ? (
          breakdown.map((item) => (
            <button
              key={item.category}
              type="button"
              className="grid grid-cols-[5.5rem_1fr] items-center gap-x-3 gap-y-1 rounded-lg px-2 py-2 text-left transition hover:bg-gray-50 sm:flex sm:gap-3 sm:px-0 sm:py-1.5"
              onClick={() => handleFilter(item.category)}
            >
              <span className="w-full truncate text-xs text-gray-600 sm:w-24 sm:pl-2">{item.category}</span>
              <span className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 sm:flex-1">
                <span
                  className={`block h-full rounded-full ${barColors[item.category] || "bg-gray-400"}`}
                  style={{ width: `${maxTotal ? (item.total / maxTotal) * 100 : 0}%` }}
                />
              </span>
              <span className="col-span-2 text-right text-xs text-gray-500 sm:col-span-1 sm:w-14">
                {formatCurrency(item.total, currency)}
              </span>
            </button>
          ))
        ) : (
          <div className="rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-400">
            No expenses for this month
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
