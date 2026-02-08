/**
 * Returns page.
 * Logs customer or supplier returns and handles approval workflow.
 */
import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import { getStoredUser, productsApi, returnsApi, storesApi } from "../services/api";

const initialForm = {
  store_id: "",
  product_id: "",
  quantity: "",
  return_type: "supplier",
  reason: "",
};

export default function Returns() {
  const user = getStoredUser();
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [returns, setReturns] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [storesRes, productsRes, returnsRes] = await Promise.all([
      storesApi.list({ active_only: true, limit: 100 }),
      productsApi.list({ limit: 200 }),
      returnsApi.list(),
    ]);
    setStores(storesRes.data);
    setProducts(productsRes.data);
    setReturns(returnsRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const productMap = useMemo(
    () => Object.fromEntries(products.map((product) => [product.id, product.name])),
    [products]
  );

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
      await returnsApi.create({
        store_id: Number(form.store_id),
        product_id: Number(form.product_id),
        quantity: Number(form.quantity),
        return_type: form.return_type,
        reason: form.reason || undefined,
      });
      setMessage("Return request created.");
      setForm((prev) => ({ ...initialForm, store_id: prev.store_id }));
      await loadData();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to create return request.");
    } finally {
      setBusy(false);
    }
  };

  const updateStatus = async (returnId, status) => {
    setBusy(true);
    setError("");
    try {
      await returnsApi.updateStatus(returnId, { status });
      await loadData();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to update return.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell title="Returns" subtitle="Track supplier and customer returns.">
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
        <h2 className="text-base font-semibold text-[#064E3B]">Create Return Request</h2>
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
              placeholder="5"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#6B7280]">
            Return type
            <select
              value={form.return_type}
              onChange={(event) => setForm((prev) => ({ ...prev, return_type: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
            >
              <option value="supplier">Supplier return</option>
              <option value="customer">Customer return</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#6B7280] md:col-span-2">
            Reason
            <input
              value={form.reason}
              onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              placeholder="Damaged packaging"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="md:col-span-3 inline-flex items-center justify-center rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Create Return
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[#064E3B]">Return Requests</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[#6B7280]">
                <th className="pb-3">Product</th>
                <th className="pb-3">Qty</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-sm text-[#6B7280]">
                    No return requests yet.
                  </td>
                </tr>
              ) : (
                returns.map((record) => (
                  <tr key={record.id} className="border-t border-[#D1FAE5]">
                    <td className="py-3">{productMap[record.product_id] || record.product_id}</td>
                    <td className="py-3">{record.quantity}</td>
                    <td className="py-3 text-[#6B7280]">{record.return_type}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-[#D1FAE5] px-3 py-1 text-xs text-[#15803D]">
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        {record.status === "pending" ? (
                          <>
                            <button
                              onClick={() => updateStatus(record.id, "approved")}
                              className="rounded bg-[#D1FAE5] px-2 py-1 text-xs text-[#15803D]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(record.id, "rejected")}
                              className="rounded bg-[#DC2626]/10 px-2 py-1 text-xs text-[#DC2626]"
                            >
                              Reject
                            </button>
                          </>
                        ) : null}
                        {record.status === "approved" ? (
                          <button
                            onClick={() => updateStatus(record.id, "completed")}
                            className="rounded bg-[#D1FAE5] px-2 py-1 text-xs text-[#15803D]"
                          >
                            Complete
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
