import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import MonthlyChart from "../components/MonthlyChart";
import formatCurrency from "../utils/formatCurrency";

const pieColors = ["#f59e0b", "#8b5cf6", "#3b82f6", "#ec4899", "#f43f5e", "#10b981", "#6366f1", "#9ca3af"];

const monthLabel = (month) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber - 1).toLocaleDateString("en-IN", {
    month: "short",
    year: "2-digit"
  });
};

const panelClasses = "rounded-xl border border-gray-100 bg-white p-5 shadow-sm";

const ReportsPage = () => {
  const { items, summary } = useSelector((state) => state.transactions);
  const lockerSummary = useSelector((state) => state.lockers.summary);
  const currency = useSelector((state) => state.auth.user?.settings?.currency || "INR");

  const monthlyData = summary.map((item) => ({
    month: monthLabel(item.month),
    income: Number(item.income || 0).toFixed(2),
    expense: Number(item.expense || 0).toFixed(2),
    net: Number((item.income || 0) - (item.expense || 0)).toFixed(2)
  }));

  const categoryData = useMemo(
    () =>
      Object.entries(
        items
          .filter((transaction) => transaction.type === "expense")
          .reduce((totals, transaction) => {
            totals[transaction.category] = (totals[transaction.category] || 0) + transaction.amount;
            return totals;
          }, {})
      ).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) })),
    [items]
  );

  const current = monthlyData[monthlyData.length - 1];
  const previous = monthlyData[monthlyData.length - 2];
  const expenseDelta = current && previous ? Number(current.expense) - Number(previous.expense) : 0;
  const incomeDelta = current && previous ? Number(current.income) - Number(previous.income) : 0;
  const lockerData = lockerSummary.breakdown.map((locker) => ({
    name: locker.name,
    value: Number(locker.amount.toFixed(2))
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <MonthlyChart summary={summary} />

        <div className={panelClasses}>
          <h3 className="mb-4 text-sm font-medium text-gray-900">Expense Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis hide />
              <Tooltip formatter={(value) => formatCurrency(value, currency)} />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className={`${panelClasses} xl:col-span-2`}>
          <h3 className="mb-4 text-sm font-medium text-gray-900">Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis hide />
              <Tooltip formatter={(value) => formatCurrency(value, currency)} />
              <Bar dataKey="income" fill="#818cf8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#fca5a5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={panelClasses}>
          <h3 className="mb-4 text-sm font-medium text-gray-900">Category Share</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {categoryData.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value, currency)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className={panelClasses}>
          <p className="text-xs text-gray-400">Expense Month-over-Month</p>
          <p className={`mt-2 text-2xl font-semibold ${expenseDelta > 0 ? "text-red-500" : "text-emerald-600"}`}>
            {formatCurrency(expenseDelta, currency)}
          </p>
        </div>
        <div className={panelClasses}>
          <p className="text-xs text-gray-400">Income Month-over-Month</p>
          <p className={`mt-2 text-2xl font-semibold ${incomeDelta >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {formatCurrency(incomeDelta, currency)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className={panelClasses}>
          <p className="text-xs text-gray-400">Locker Savings</p>
          <p className="mt-2 text-2xl font-semibold text-indigo-600">
            {formatCurrency(lockerSummary.total, currency)}
          </p>
          <p className="mt-1 text-xs text-gray-400">{lockerSummary.count.toFixed(0)} lockers</p>
        </div>
        <div className={panelClasses}>
          <p className="text-xs text-gray-400">Total Locker Credits</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {formatCurrency(lockerSummary.credit, currency)}
          </p>
        </div>
        <div className={panelClasses}>
          <p className="text-xs text-gray-400">Total Locker Debits</p>
          <p className="mt-2 text-2xl font-semibold text-red-500">
            {formatCurrency(lockerSummary.debit, currency)}
          </p>
        </div>
      </div>

      <div className={panelClasses}>
        <h3 className="mb-4 text-sm font-medium text-gray-900">Locker Breakdown</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={lockerData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis hide />
            <Tooltip formatter={(value) => formatCurrency(value, currency)} />
            <Bar dataKey="value" fill="#818cf8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportsPage;
