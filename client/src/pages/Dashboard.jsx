import { useMemo } from "react";
import { useSelector } from "react-redux";
import { ArrowDownRight, ArrowUpRight, Target, TrendingUp } from "lucide-react";
import CategoryBreakdown from "../components/CategoryBreakdown";
import MonthlyChart from "../components/MonthlyChart";
import SummaryCards from "../components/SummaryCards";
import TransactionItem from "../components/TransactionItem";
import formatCurrency from "../utils/formatCurrency";

const Dashboard = () => {
  const { items, summary } = useSelector((state) => state.transactions);
  const currency = useSelector((state) => state.auth.user?.settings?.currency || "INR");

  const insights = useMemo(() => {
    const expenses = items.filter((transaction) => transaction.type === "expense");
    const income = items
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);
    const expenseTotal = expenses.reduce((total, transaction) => total + transaction.amount, 0);
    const biggestExpense = expenses.sort((first, second) => second.amount - first.amount)[0];
    const activeDays = new Set(items.map((transaction) => transaction.date.slice(0, 10))).size || 1;
    const savingRate = income ? ((income - expenseTotal) / income) * 100 : 0;

    return {
      biggestExpense,
      dailyAverage: expenseTotal / activeDays,
      savingRate,
      net: income - expenseTotal
    };
  }, [items]);

  const recentTransactions = items.slice(0, 5);

  return (
    <>
      <SummaryCards transactions={items} />

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="flex flex-col gap-5 xl:col-span-2">
          <MonthlyChart summary={summary} />

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Recent Transactions</h3>
              <span className="text-xs text-gray-400">{recentTransactions.length.toFixed(0)} latest</span>
            </div>
            <div className="flex flex-col gap-1">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <TransactionItem key={transaction._id} transaction={transaction} />
                ))
              ) : (
                <div className="rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-400">
                  No transactions yet
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-medium text-gray-900">Spending Insights</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">
                  <ArrowDownRight size={17} />
                </div>
                <p className="text-xs text-gray-400">Biggest Expense</p>
                <p className="mt-1 truncate text-lg font-semibold text-gray-900">
                  {insights.biggestExpense ? formatCurrency(insights.biggestExpense.amount, currency) : formatCurrency(0, currency)}
                </p>
                <p className="mt-1 truncate text-xs text-gray-400">
                  {insights.biggestExpense?.reason || "No expense recorded"}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Target size={17} />
                </div>
                <p className="text-xs text-gray-400">Daily Average</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {formatCurrency(insights.dailyAverage, currency)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <TrendingUp size={17} />
                </div>
                <p className="text-xs text-gray-400">Monthly Saving Rate</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{insights.savingRate.toFixed(2)}%</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <ArrowUpRight size={17} />
                </div>
                <p className="text-xs text-gray-400">Net Movement</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {formatCurrency(insights.net, currency)}
                </p>
              </div>
            </div>
          </div>
          <CategoryBreakdown transactions={items} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
