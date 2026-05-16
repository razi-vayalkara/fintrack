import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { LockKeyhole, Minus, Pencil, Plus, Trash2 } from "lucide-react";
import {
  createLocker,
  deleteLocker,
  moveLockerAmount,
  updateLocker
} from "../store/lockerSlice";
import formatCurrency from "../utils/formatCurrency";

const inputClasses =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const initialLocker = { name: "", amount: "", note: "" };
const initialMovement = { type: "credit", amount: "", note: "" };

const LockersPage = () => {
  const dispatch = useDispatch();
  const { items, summary, status } = useSelector((state) => state.lockers);
  const currency = useSelector((state) => state.auth.user?.settings?.currency || "INR");
  const [lockerForm, setLockerForm] = useState(initialLocker);
  const [editingId, setEditingId] = useState(null);
  const [movementByLocker, setMovementByLocker] = useState({});

  const biggestLocker = useMemo(
    () => [...items].sort((first, second) => second.amount - first.amount)[0],
    [items]
  );

  const updateLockerForm = (key, value) => {
    setLockerForm((current) => ({ ...current, [key]: value }));
  };

  const updateMovement = (lockerId, key, value) => {
    setMovementByLocker((current) => ({
      ...current,
      [lockerId]: {
        ...initialMovement,
        ...current[lockerId],
        [key]: value
      }
    }));
  };

  const resetLockerForm = () => {
    setLockerForm(initialLocker);
    setEditingId(null);
  };

  const handleSubmitLocker = async (event) => {
    event.preventDefault();
    const payload = {
      name: lockerForm.name,
      amount: Number(lockerForm.amount || 0),
      note: lockerForm.note
    };

    const result = editingId
      ? await dispatch(updateLocker({ id: editingId, updates: payload }))
      : await dispatch(createLocker(payload));

    if ((editingId ? updateLocker : createLocker).fulfilled.match(result)) {
      toast.success(editingId ? "Locker updated" : "Locker created");
      resetLockerForm();
    } else {
      toast.error(result.payload || "Unable to save locker");
    }
  };

  const handleEdit = (locker) => {
    setEditingId(locker._id);
    setLockerForm({
      name: locker.name,
      amount: String(locker.amount),
      note: locker.note || ""
    });
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteLocker(id));

    if (deleteLocker.fulfilled.match(result)) {
      toast.success("Locker deleted");
    } else {
      toast.error(result.payload || "Unable to delete locker");
    }
  };

  const handleMove = async (lockerId) => {
    const movement = movementByLocker[lockerId] || initialMovement;
    const result = await dispatch(
      moveLockerAmount({
        id: lockerId,
        movement: { ...movement, amount: Number(movement.amount) }
      })
    );

    if (moveLockerAmount.fulfilled.match(result)) {
      toast.success(movement.type === "credit" ? "Amount credited" : "Amount debited");
      setMovementByLocker((current) => ({ ...current, [lockerId]: initialMovement }));
    } else {
      toast.error(result.payload || "Unable to update locker amount");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <div className="flex flex-col gap-5 xl:col-span-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-xs text-gray-400">Total In Lockers</p>
            <p className="mt-1 text-2xl font-semibold text-indigo-600">
              {formatCurrency(summary.total, currency)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-xs text-gray-400">Lockers</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{summary.count.toFixed(0)}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-xs text-gray-400">Largest Locker</p>
            <p className="mt-1 truncate text-2xl font-semibold text-gray-900">
              {biggestLocker?.name || "None"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Your Lockers</h3>
            <span className="text-xs text-gray-400">{status === "loading" ? "Loading" : "Savings only"}</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {items.length > 0 ? (
              items.map((locker) => {
                const movement = movementByLocker[locker._id] || initialMovement;
                return (
                  <div key={locker._id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <LockKeyhole size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">{locker.name}</p>
                          <p className="mt-1 truncate text-xs text-gray-400">{locker.note || "No note"}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <p className="text-lg font-semibold text-indigo-600">
                          {formatCurrency(locker.amount, currency)}
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-white hover:text-indigo-600"
                            onClick={() => handleEdit(locker)}
                            aria-label="Edit locker"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-white hover:text-red-500"
                            onClick={() => handleDelete(locker._id)}
                            aria-label="Delete locker"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[9rem_1fr_1fr_auto]">
                      <div className="flex rounded-lg bg-white p-1">
                        {["credit", "debit"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`flex flex-1 items-center justify-center gap-1 rounded-md px-3 py-2 text-xs capitalize transition ${
                              movement.type === type
                                ? "bg-indigo-50 font-medium text-indigo-600"
                                : "text-gray-500"
                            }`}
                            onClick={() => updateMovement(locker._id, "type", type)}
                          >
                            {type === "credit" ? <Plus size={13} /> : <Minus size={13} />}
                            {type}
                          </button>
                        ))}
                      </div>
                      <input
                        className={inputClasses}
                        type="number"
                        min="0"
                        step="0.01"
                        value={movement.amount}
                        onChange={(event) => updateMovement(locker._id, "amount", event.target.value)}
                        placeholder="Amount"
                      />
                      <input
                        className={inputClasses}
                        value={movement.note}
                        onChange={(event) => updateMovement(locker._id, "note", event.target.value)}
                        placeholder="Note"
                      />
                      <button
                        type="button"
                        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                        onClick={() => handleMove(locker._id)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-xl bg-gray-50 px-4 py-10 text-center text-sm text-gray-400">
                No lockers created yet
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitLocker} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-medium text-gray-900">
          {editingId ? "Edit Locker" : "Create Locker"}
        </h3>
        <div className="flex flex-col gap-4">
          <input
            className={inputClasses}
            value={lockerForm.name}
            onChange={(event) => updateLockerForm("name", event.target.value)}
            placeholder="Locker name"
            required
          />
          <input
            className={inputClasses}
            type="number"
            min="0"
            step="0.01"
            value={lockerForm.amount}
            onChange={(event) => updateLockerForm("amount", event.target.value)}
            placeholder="Opening amount"
            disabled={Boolean(editingId)}
          />
          <input
            className={inputClasses}
            value={lockerForm.note}
            onChange={(event) => updateLockerForm("note", event.target.value)}
            placeholder="Note"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            {editingId ? "Save Locker" : "Create Locker"}
          </button>
          {editingId ? (
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              onClick={resetLockerForm}
            >
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default LockersPage;
