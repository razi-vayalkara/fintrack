import { useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Bus,
  MoreVertical,
  Pencil,
  HeartPulse,
  House,
  ShoppingBag,
  Trash2,
  Utensils,
  Wallet
} from "lucide-react";
import { useSelector } from "react-redux";
import formatCurrency from "../utils/formatCurrency";

const categoryStyles = {
  Food: { classes: "bg-amber-50 text-amber-600", icon: Utensils },
  Rent: { classes: "bg-violet-50 text-violet-600", icon: House },
  Salary: { classes: "bg-emerald-50 text-emerald-600", icon: Wallet },
  Transport: { classes: "bg-blue-50 text-blue-600", icon: Bus },
  Health: { classes: "bg-rose-50 text-rose-600", icon: HeartPulse },
  Shopping: { classes: "bg-pink-50 text-pink-600", icon: ShoppingBag },
  Freelance: { classes: "bg-indigo-50 text-indigo-600", icon: BriefcaseBusiness },
  Entertainment: { classes: "bg-pink-50 text-pink-600", icon: Wallet },
  Other: { classes: "bg-gray-100 text-gray-500", icon: Wallet }
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

const TransactionItem = ({ transaction, onDelete, onEdit }) => {
  const currency = useSelector((state) => state.auth.user?.settings?.currency || "INR");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pressTimer = useRef(null);
  const style = categoryStyles[transaction.category] || categoryStyles.Other;
  const Icon = style.icon;
  const amountPrefix = transaction.type === "income" ? "+" : "-";

  const clearPressTimer = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handlePressStart = () => {
    if (!window.matchMedia("(hover: none)").matches || (!onDelete && !onEdit)) return;

    pressTimer.current = window.setTimeout(() => {
      setIsMenuOpen(true);
    }, 450);
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    onEdit?.(transaction);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    onDelete?.(transaction._id);
  };

  return (
    <div
      className="group flex flex-wrap items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-50 sm:flex-nowrap"
      onPointerDown={handlePressStart}
      onPointerUp={clearPressTimer}
      onPointerCancel={clearPressTimer}
      onPointerLeave={clearPressTimer}
      onPointerMove={clearPressTimer}
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.classes}`}>
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-800">{transaction.reason}</p>
        <p className="truncate text-xs text-gray-400">
          {transaction.category} • {formatDate(transaction.date)}
        </p>
      </div>

      <p
        className={`ml-12 text-sm font-semibold sm:ml-0 ${
          transaction.type === "income" ? "text-emerald-600" : "text-red-500"
        }`}
      >
        {amountPrefix}
        {formatCurrency(transaction.amount, currency)}
      </p>

      {onDelete || onEdit ? (
        <>
        <button
          type="button"
          className="ml-auto rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-indigo-600 sm:hidden"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Transaction actions"
        >
          <MoreVertical size={17} />
        </button>

        <div className="ml-auto hidden items-center gap-1 text-gray-300 transition sm:flex sm:opacity-0 sm:group-hover:opacity-100">
          {onEdit ? (
            <button
              type="button"
              className="rounded-lg p-2 transition hover:bg-indigo-50 hover:text-indigo-600"
              onClick={handleEdit}
              aria-label="Edit transaction"
            >
              <Pencil size={15} />
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              className="rounded-lg p-2 transition hover:bg-red-50 hover:text-red-400"
              onClick={handleDelete}
              aria-label="Delete transaction"
            >
              <Trash2 size={15} />
            </button>
          ) : null}
        </div>
        </>
      ) : null}

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-gray-900/20 px-4 pb-4 sm:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close actions"
          />
          <div className="relative w-full rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className="px-2 pb-3 pt-1">
              <p className="truncate text-sm font-medium text-gray-900">{transaction.reason}</p>
              <p className="text-xs text-gray-400">{transaction.category}</p>
            </div>
            {onEdit ? (
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600"
                onClick={handleEdit}
              >
                <Pencil size={16} />
                Edit transaction
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-500 transition hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 size={16} />
                Delete transaction
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TransactionItem;
