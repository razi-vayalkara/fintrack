import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { updateSettings } from "../store/authSlice";

const categories = [
  "Food",
  "Rent",
  "Transport",
  "Entertainment",
  "Health",
  "Shopping",
  "Salary",
  "Freelance",
  "Other"
];

const inputClasses =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.auth.user?.settings);
  const [form, setForm] = useState({
    currency: "INR",
    density: "comfortable",
    defaultCategory: "Food",
    monthStartDay: 1,
    notifications: true
  });

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(updateSettings(form));

    if (updateSettings.fulfilled.match(result)) {
      toast.success("Settings saved");
    } else {
      toast.error(result.payload || "Unable to save settings");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
        <h3 className="text-sm font-medium text-gray-900">Preferences</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-xs text-gray-400">Currency</span>
            <select
              className={inputClasses}
              value={form.currency}
              onChange={(event) => updateField("currency", event.target.value)}
            >
              <option value="INR">Indian Rupee</option>
              <option value="USD">US Dollar</option>
              <option value="EUR">Euro</option>
              <option value="GBP">British Pound</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs text-gray-400">Theme Density</span>
            <select
              className={inputClasses}
              value={form.density}
              onChange={(event) => updateField("density", event.target.value)}
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs text-gray-400">Default Category</span>
            <select
              className={inputClasses}
              value={form.defaultCategory}
              onChange={(event) => updateField("defaultCategory", event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs text-gray-400">Financial Month Starts</span>
            <input
              className={inputClasses}
              type="number"
              min="1"
              max="28"
              value={form.monthStartDay}
              onChange={(event) => updateField("monthStartDay", Number(event.target.value))}
            />
          </label>
        </div>

        <label className="mt-5 flex items-center justify-between rounded-xl bg-gray-50 p-4">
          <span>
            <span className="block text-sm font-medium text-gray-900">Notifications</span>
            <span className="text-xs text-gray-400">Show success and error toasts for actions</span>
          </span>
          <input
            type="checkbox"
            checked={form.notifications}
            onChange={(event) => updateField("notifications", event.target.checked)}
            className="h-4 w-4 accent-indigo-600"
          />
        </label>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-900">Saved Behavior</h3>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            These settings are saved to your account and restored after login.
          </p>
          <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </form>
  );
};

export default SettingsPage;
