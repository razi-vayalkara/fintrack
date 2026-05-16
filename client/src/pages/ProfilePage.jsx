import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CreditCard, KeyRound, LogOut, Trash2, User } from "lucide-react";
import { changePassword, deleteAccount, logout } from "../store/authSlice";
import { clearLockers } from "../store/lockerSlice";
import { clearTransactions } from "../store/transactionSlice";

const inputClasses =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { filters, items } = useSelector((state) => state.transactions);
  const lockers = useSelector((state) => state.lockers.items);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const updatePasswordField = (key, value) => {
    setPasswords((current) => ({ ...current, [key]: value }));
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearLockers());
    dispatch(clearTransactions());
    navigate("/login", { replace: true });
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    const result = await dispatch(
      changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })
    );

    if (changePassword.fulfilled.match(result)) {
      toast.success("Password changed");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      toast.error(result.payload || "Unable to change password");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      toast.error("Type DELETE to confirm");
      return;
    }

    const result = await dispatch(deleteAccount());

    if (deleteAccount.fulfilled.match(result)) {
      dispatch(clearLockers());
      dispatch(clearTransactions());
      toast.success("Account deleted");
      navigate("/login", { replace: true });
    } else {
      toast.error(result.payload || "Unable to delete account");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <div className="flex flex-col gap-5 xl:col-span-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <User size={26} />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{user?.name || "Finance User"}</p>
            <p className="mt-1 text-sm text-gray-400">{user?.email || "Account"}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-400">Transactions</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{items.length.toFixed(0)}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-400">Active Month</p>
            <p className="mt-1 text-2xl font-semibold text-indigo-600">{filters.month}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-400">Categories</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {new Set(items.map((item) => item.category)).size.toFixed(0)}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 sm:col-span-3">
            <p className="text-xs text-gray-400">Lockers</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{lockers.length.toFixed(0)}</p>
          </div>
        </div>
      </div>

        <form onSubmit={handleChangePassword} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <KeyRound size={18} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
              <p className="text-xs text-gray-400">Update your account password securely</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              className={inputClasses}
              type="password"
              value={passwords.currentPassword}
              onChange={(event) => updatePasswordField("currentPassword", event.target.value)}
              placeholder="Current password"
              required
            />
            <input
              className={inputClasses}
              type="password"
              value={passwords.newPassword}
              onChange={(event) => updatePasswordField("newPassword", event.target.value)}
              placeholder="New password"
              minLength={6}
              required
            />
            <input
              className={inputClasses}
              type="password"
              value={passwords.confirmPassword}
              onChange={(event) => updatePasswordField("confirmPassword", event.target.value)}
              placeholder="Confirm password"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-5 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Change Password
          </button>
        </form>

        <div className="rounded-xl border border-red-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <Trash2 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Danger Zone</h3>
              <p className="text-xs text-gray-400">Delete your account and all saved data</p>
            </div>
          </div>

          <div className="rounded-xl bg-red-50 p-4">
            <p className="text-sm font-medium text-red-600">This action cannot be undone.</p>
            <p className="mt-2 text-sm leading-6 text-red-500">
              This deletes your account, transactions, suggestions, lockers, locker movements, and saved settings.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <input
              className="w-full rounded-lg border border-red-100 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100"
              value={deleteConfirm}
              onChange={(event) => setDeleteConfirm(event.target.value)}
              placeholder="Type DELETE to confirm"
            />
            <button
              type="button"
              className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-200"
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== "DELETE"}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <CreditCard size={18} />
        </div>
        <p className="text-sm font-medium text-gray-900">Workspace</p>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Your transactions, suggestions, and preferences are tied to this account.
        </p>
        <button
          type="button"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-white"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
