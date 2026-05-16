import { useEffect, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { fetchMe } from "../store/authSlice";
import { fetchLockers, fetchLockerSummary } from "../store/lockerSlice";
import { fetchSummary, fetchTransactions, setFilter } from "../store/transactionSlice";

const titles = {
  "/dashboard": "Dashboard",
  "/lockers": "Lockers",
  "/transactions": "Transactions",
  "/reports": "Reports",
  "/settings": "Settings",
  "/profile": "Profile"
};

const monthPickerPaths = new Set(["/dashboard", "/transactions", "/reports"]);

const AppLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token, user } = useSelector((state) => state.auth);
  const { filters } = useSelector((state) => state.transactions);

  const title = useMemo(() => titles[location.pathname] || "Dashboard", [location.pathname]);
  const showMonthPicker = monthPickerPaths.has(location.pathname);

  useEffect(() => {
    if (token && !user) dispatch(fetchMe());
  }, [dispatch, token, user]);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchTransactions());
  }, [dispatch, filters, token]);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchSummary());
    dispatch(fetchLockers());
    dispatch(fetchLockerSummary());
  }, [dispatch, token]);

  const handleMonthChange = (month) => {
    dispatch(setFilter({ key: "month", value: month }));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <Sidebar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-5 sm:px-6 lg:max-w-none lg:pb-8 lg:pl-64 lg:pr-8 lg:pt-8">
        <Topbar
          title={title}
          month={filters.month}
          onMonthChange={handleMonthChange}
          showMonthPicker={showMonthPicker}
        />
        <div className="mt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
