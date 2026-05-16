import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useSelector } from "react-redux";
import formatCurrency from "../utils/formatCurrency";

const monthLabel = (month) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber - 1).toLocaleDateString("en-IN", { month: "short" });
};

const MonthlyChart = ({ summary }) => {
  const currency = useSelector((state) => state.auth.user?.settings?.currency || "INR");
  const data = summary.map((item) => ({
    month: monthLabel(item.month),
    income: Number(item.income || 0).toFixed(2),
    expense: Number(item.expense || 0).toFixed(2)
  }));

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-medium text-gray-900">Monthly Flow</h3>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            Income
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="h-2 w-2 rounded-full bg-red-300" />
            Expense
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
          />
          <YAxis hide />
          <Tooltip
            formatter={(value) => formatCurrency(value, currency)}
            contentStyle={{
              background: "#fff",
              border: "1px solid #f3f4f6",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
              color: "#374151",
              fontSize: "12px"
            }}
            cursor={{ fill: "#f9fafb" }}
          />
          <Bar dataKey="income" fill="#818cf8" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" fill="#fca5a5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;
