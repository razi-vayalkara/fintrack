import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { IndianRupee } from "lucide-react";
import { login, register } from "../store/authSlice";

const inputClasses =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const AuthPage = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const action = mode === "login" ? login : register;
    const payload = mode === "login" ? { email: form.email, password: form.password } : form;
    const result = await dispatch(action(payload));

    if (action.fulfilled.match(result)) {
      toast.success(mode === "login" ? "Welcome back" : "Account created");
    } else {
      toast.error(result.payload || "Authentication failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <IndianRupee size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">FinTrack</h1>
            <p className="text-sm text-gray-400">Your private finance workspace</p>
          </div>
        </div>

        <div className="mb-5 flex rounded-lg bg-gray-100 p-1">
          {["login", "register"].map((item) => (
            <button
              key={item}
              type="button"
              className={`flex-1 rounded-md px-4 py-2 text-sm capitalize transition ${
                mode === item ? "bg-white font-medium text-indigo-600 shadow-sm" : "text-gray-500"
              }`}
              onClick={() => setMode(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <input
              className={inputClasses}
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Name"
              required
            />
          ) : null}
          <input
            className={inputClasses}
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="Email"
            required
          />
          <input
            className={inputClasses}
            type="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="Password"
            minLength={6}
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
