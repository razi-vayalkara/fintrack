import { NavLink } from "react-router-dom";
import {
  ArrowLeftRight,
  Github,
  Home,
  Instagram,
  LockKeyhole,
  LogOut,
  PieChart,
  Settings,
  User
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { clearLockers } from "../store/lockerSlice";
import { clearTransactions } from "../store/transactionSlice";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/lockers", label: "Lockers", icon: LockKeyhole },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/reports", label: "Reports", icon: PieChart },
  { to: "/settings", label: "Settings", icon: Settings }
];

const linkClasses = ({ isActive }) =>
  `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] transition sm:text-xs lg:flex-none lg:flex-row lg:gap-3 lg:px-4 lg:py-2.5 lg:text-sm ${
    isActive
      ? "bg-indigo-50 font-medium text-indigo-600"
      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
  }`;

const Sidebar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearLockers());
    dispatch(clearTransactions());
  };

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white lg:bottom-auto lg:right-auto lg:top-0 lg:h-screen lg:w-56 lg:border-r lg:border-t-0">
      <div className="flex h-full items-center justify-around gap-1 px-2 py-2 lg:flex-col lg:items-stretch lg:justify-start lg:p-4">
      <div className="hidden items-center gap-2 px-2 py-3 lg:flex">
        <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
        <span className="font-semibold text-gray-900">FinTrack</span>
      </div>

      <p className="mb-1 mt-4 hidden px-4 text-[10px] uppercase tracking-widest text-gray-300 lg:block">Menu</p>
      <nav className="flex w-full items-center justify-around gap-1 lg:flex-col lg:items-stretch">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={linkClasses}
            >
              <Icon size={16} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <p className="mb-1 mt-4 hidden px-4 text-[10px] uppercase tracking-widest text-gray-300 lg:block">Account</p>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `hidden items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition lg:flex ${
            isActive
              ? "bg-indigo-50 font-medium text-indigo-600"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`
        }
      >
        <User size={16} />
        Profile
      </NavLink>
      <button
        type="button"
        className="hidden items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 lg:flex"
        onClick={handleLogout}
      >
        <LogOut size={16} />
        Logout
      </button>

      <div className="mt-auto hidden border-t border-gray-100 px-4 pt-4 lg:block">
        <p className="text-[10px] uppercase tracking-widest text-gray-300">Developer</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <a
            href="https://github.com/razi-vayalkara"
            target="_blank"
            rel="noreferrer"
            className="min-w-0 truncate text-xs font-medium text-gray-500 transition hover:underline"
          >
            Razi Vayalkara
          </a>
          <div className="flex shrink-0 items-center gap-1">
            <a
              href="https://github.com/razi-vayalkara"
              target="_blank"
              rel="noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
              aria-label="GitHub"
            >
              <Github size={15} />
            </a>
            <a
              href="https://instagram.com/razi.developer"
              target="_blank"
              rel="noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
              aria-label="Instagram"
            >
              <Instagram size={15} />
            </a>
          </div>
        </div>
      </div>
      </div>
    </aside>
  );
};

export default Sidebar;
