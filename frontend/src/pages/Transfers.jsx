/**
 * Stock transfers page.
 * Moves inventory between stores and tracks approval status.
 */
import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import { getStoredUser, productsApi, storesApi, transfersApi } from "../services/api";

const initialForm = { from_store_id: "", to_store_id: "", product_id: "", quantity: "", notes: "" };

export default function Transfers() {
  const user = getStoredUser();
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [storesRes, productsRes, transfersRes] = await Promise.all([
      storesApi.list({ active_only: true, limit: 100 }),
      productsApi.list({ limit: 200 }),
      transfersApi.list(),
    ]);
    setStores(storesRes.data);
    setProducts(productsRes.data);
    setTransfers(transfersRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const storeMap = useMemo(
    () => Object.fromEntries(stores.map((store) => [store.id, store.name])),
    [stores]
  );
  const productMap = useMemo(
    () => Object.fromEntries(products.map((product) => [product.id, product.name])),
    [products]
  );

  useEffect(() => {
    if (user?.role === "admin" && user?.store_id) {
      setForm((prev) => ({ ...prev, from_store_id: user.store_id }));
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await transfersApi.create({
        from_store_id: Number(form.from_store_id),
        to_store_id: Number(form.to_store_id),
        product_id: Number(form.product_id),
        quantity: Number(form.quantity),
        notes: form.notes || undefined,
      });
      setMessage("Transfer created.");
      setForm((prev) => ({ ...initialForm, from_store_id: prev.from_store_id }));
      await loadData();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to create transfer.");
    } finally {
      setBusy(false);
    }
  };

  const updateStatus = async (transferId, status) => {
    setBusy(true);
    setError("");
    try {
      await transfersApi.updateStatus(transferId, { status });
      await loadData();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to update transfer.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell title="Stock Transfers" subtitle="Move stock between stores.">
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
        <h2 className="text-base font-semibold text-[#064E3B]">New Transfer</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-1 text-xs text-[#6B7280]">
            From store
            <select
              value={form.from_store_id}
              onChange={(event) => setForm((prev) => ({ ...prev, from_store_id: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              required
              disabled={user?.role === "admin"}
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
            To store
            <select
              value={form.to_store_id}
              onChange={(event) => setForm((prev) => ({ ...prev, to_store_id: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
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
            Product
            <select
              value={form.product_id}
              onChange={(event) => setForm((prev) => ({ ...prev, product_id: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              required
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#6B7280]">
            Quantity
            <input
              value={form.quantity}
              onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              placeholder="20"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#6B7280] md:col-span-2">
            Notes
            <input
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              placeholder="Optional transfer notes"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="md:col-span-3 inline-flex items-center justify-center rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Create Transfer
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[#064E3B]">Transfer Activity</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[#6B7280]">
                <th className="pb-3">From</th>
                <th className="pb-3">To</th>
                <th className="pb-3">Product</th>
                <th className="pb-3">Qty</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transfers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-sm text-[#6B7280]">
                    No transfers recorded.
                  </td>
                </tr>
              ) : (
                transfers.map((transfer) => (
                  <tr key={transfer.id} className="border-t border-[#D1FAE5]">
                    <td className="py-3">{storeMap[transfer.from_store_id] || transfer.from_store_id}</td>
                    <td className="py-3">{storeMap[transfer.to_store_id] || transfer.to_store_id}</td>
                    <td className="py-3">{productMap[transfer.product_id] || transfer.product_id}</td>
                    <td className="py-3">{transfer.quantity}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-[#D1FAE5] px-3 py-1 text-xs text-[#15803D]">
                        {transfer.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        {transfer.status === "pending" ? (
                          <button
                            onClick={() => updateStatus(transfer.id, "approved")}
                            className="rounded bg-[#D1FAE5] px-2 py-1 text-xs text-[#15803D]"
                          >
                            Approve
                          </button>
                        ) : null}
                        {transfer.status === "approved" ? (
                          <button
                            onClick={() => updateStatus(transfer.id, "completed")}
                            className="rounded bg-[#D1FAE5] px-2 py-1 text-xs text-[#15803D]"
                          >
                            Complete
                          </button>
                        ) : null}
                        {transfer.status !== "completed" && transfer.status !== "cancelled" ? (
                          <button
                            onClick={() => updateStatus(transfer.id, "cancelled")}
                            className="rounded bg-[#DC2626]/10 px-2 py-1 text-xs text-[#DC2626]"
                          >
                            Cancel
                          </button>
                        ) : null}
                      </div>
                    </td>
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
