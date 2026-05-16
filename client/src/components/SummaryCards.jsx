import { useSelector } from "react-redux";
import formatCurrency from "../utils/formatCurrency";

const SummaryCards = ({ transactions }) => {
  const currency = useSelector((state) => state.auth.user?.settings?.currency || "INR");
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const categoryTotals = transactions.reduce((totals, transaction) => {
    if (transaction.type === "expense") {
      totals[transaction.category] = (totals[transaction.category] || 0) + transaction.amount;
    }
    return totals;
  }, {});

  const topCategory =
    Object.entries(categoryTotals).sort(([, first], [, second]) => second - first)[0]?.[0] || "None";

  const cards = [
    {
      label: "Total Income",
      value: formatCurrency(income, currency),
      sub: "Money received",
      color: "text-emerald-600"
    },
    {
      label: "Total Expenses",
      value: formatCurrency(expenses, currency),
      sub: "Money spent",
      color: "text-red-500"
    },
    {
      label: "Net Balance",
      value: formatCurrency(income - expenses, currency),
      sub: "Income minus expenses",
      color: "text-indigo-600"
    },
    {
      label: "Top Category",
      value: topCategory,
      sub: "Highest expense category",
      color: "text-gray-900",
      badge: "Active"
    }
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="mb-1 text-xs text-gray-400">{card.label}</p>
          <div className="flex min-w-0 items-center gap-2">
            <p className={`min-w-0 truncate text-xl font-semibold sm:text-2xl ${card.color}`}>{card.value}</p>
            {card.badge ? (
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600">
                {card.badge}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-gray-400">{card.sub}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
