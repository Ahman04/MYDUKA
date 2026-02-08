/**
 * Expenses page.
 * Captures operational costs and lists recent expense entries.
 */
import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import { expensesApi, getStoredUser, storesApi } from "../services/api";

const initialForm = { store_id: "", category: "", amount: "", description: "", incurred_at: "" };

export default function Expenses() {
  const user = getStoredUser();
  const [stores, setStores] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [storesRes, expensesRes] = await Promise.all([
      storesApi.list({ active_only: true, limit: 100 }),
      expensesApi.list(),
    ]);
    setStores(storesRes.data);
    setExpenses(expensesRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (user?.role === "admin" && user?.store_id) {
      setForm((prev) => ({ ...prev, store_id: user.store_id }));
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await expensesApi.create({
        store_id: Number(form.store_id),
        category: form.category,
        amount: Number(form.amount),
        description: form.description || undefined,
        incurred_at: form.incurred_at ? new Date(form.incurred_at).toISOString() : undefined,
      });
      setMessage("Expense recorded.");
      setForm((prev) => ({ ...initialForm, store_id: prev.store_id }));
      await loadData();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to record expense.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell title="Expenses" subtitle="Track operational expenses.">
      {error ? (
        <div className="mb-4 rounded-xl border border-[#DC2626]/30 bg-[#DC2626]/10 px-4 py-3 text-sm text-[#DC2626]">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="mb-4 rounded-xl border border-[#D1FAE5] bg-white px-4 py-3 text-sm text-[#15803D]">
          {message}
        </div>
      ) : null}

      <section className="rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[#064E3B]">Log Expense</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-1 text-xs text-[#6B7280]">
            Store
            <select
              value={form.store_id}
              onChange={(event) => setForm((prev) => ({ ...prev, store_id: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              disabled={user?.role === "admin"}
              required
            >
              <option value="">Select store</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#6B7280]">
            Category
            <input
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              placeholder="Rent"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#6B7280]">
            Amount
            <input
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              placeholder="2000"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#6B7280]">
            Date
            <input
              type="date"
              value={form.incurred_at}
              onChange={(event) => setForm((prev) => ({ ...prev, incurred_at: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#6B7280] md:col-span-2">
            Description
            <input
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              placeholder="Monthly rent payment"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="md:col-span-3 inline-flex items-center justify-center rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Save Expense
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[#064E3B]">Expense History</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[#6B7280]">
                <th className="pb-3">Category</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-sm text-[#6B7280]">
                    No expenses recorded.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="border-t border-[#D1FAE5]">
                    <td className="py-3">{expense.category}</td>
                    <td className="py-3">KES {Number(expense.amount).toFixed(2)}</td>
                    <td className="py-3 text-[#6B7280]">
                      {new Date(expense.incurred_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-[#6B7280]">{expense.description || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
