import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  X
} from "lucide-react";
import { logout } from "../store/authSlice";
import { clearLockers } from "../store/lockerSlice";
import { clearTransactions } from "../store/transactionSlice";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

const formatMonthLabel = (month) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber - 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  });
};

const Topbar = ({ title, month, onMonthChange, showMonthPicker = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [selectedYear, selectedMonth] = useMemo(() => month.split("-").map(Number), [month]);
  const [visibleYear, setVisibleYear] = useState(selectedYear);
  const initials = (user?.name || "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    setVisibleYear(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    if (!isOpen && !isAccountOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key === "Escape") setIsAccountOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAccountOpen, isOpen]);

  const selectMonth = (monthIndex) => {
    onMonthChange(`${visibleYear}-${String(monthIndex + 1).padStart(2, "0")}`);
    setIsOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearLockers());
    dispatch(clearTransactions());
    setIsAccountOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="mb-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-between gap-3 sm:justify-start">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

        <div className="relative lg:hidden">
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white pl-1.5 pr-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
            onClick={() => setIsAccountOpen((open) => !open)}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
              {initials}
            </span>
            <span className="hidden max-w-28 truncate md:block">{user?.name || "Profile"}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {isAccountOpen ? (
            <div className="absolute right-0 top-12 z-40 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm sm:left-0 sm:right-auto">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="truncate text-sm font-medium text-gray-900">{user?.name || "Finance User"}</p>
                <p className="truncate text-xs text-gray-400">{user?.email || "Account"}</p>
              </div>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-indigo-600"
                onClick={() => setIsAccountOpen(false)}
              >
                <User size={16} />
                Profile
              </Link>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-600 transition hover:bg-gray-50 hover:text-red-500"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex w-full items-center gap-2 sm:w-auto">
        {showMonthPicker ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 sm:flex-none"
          >
            <Calendar size={14} />
            <span>{formatMonthLabel(month)}</span>
            <ChevronDown size={14} />
          </button>
        ) : null}
      </div>

      {isOpen && showMonthPicker ? (
        <div className="fixed inset-0 z-50 flex items-end bg-gray-900/20 px-4 pb-4 sm:items-center sm:justify-center sm:p-6">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsOpen(false)}
            aria-label="Close calendar"
          />

          <div className="relative w-full max-w-sm rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
                onClick={() => setVisibleYear((year) => year - 1)}
                aria-label="Previous year"
              >
                <ChevronLeft size={18} />
              </button>

              <p className="text-sm font-semibold text-gray-900">{visibleYear}</p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setVisibleYear((year) => year + 1)}
                  aria-label="Next year"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  type="button"
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close calendar"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {months.map((label, index) => {
                const isSelected = visibleYear === selectedYear && index + 1 === selectedMonth;

                return (
                  <button
                    key={label}
                    type="button"
                    className={`rounded-lg px-3 py-3 text-sm transition ${
                      isSelected
                        ? "bg-indigo-600 font-medium text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                    onClick={() => selectMonth(index)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Topbar;
