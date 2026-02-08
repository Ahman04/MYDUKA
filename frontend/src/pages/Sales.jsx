/**
 * Sales page.
 * Records sales and summarizes recent transactions.
 */
import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import { getStoredUser, productsApi, salesApi, storesApi } from "../services/api";

const initialForm = { store_id: "", product_id: "", quantity: "", unit_price: "", notes: "" };

export default function Sales() {
  const user = getStoredUser();
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [storesRes, productsRes, salesRes] = await Promise.all([
      storesApi.list({ active_only: true, limit: 100 }),
      productsApi.list({ limit: 200 }),
      salesApi.list(),
    ]);
    setStores(storesRes.data);
    setProducts(productsRes.data);
    setSales(salesRes.data);
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
      await salesApi.create({
        store_id: Number(form.store_id),
        product_id: Number(form.product_id),
        quantity: Number(form.quantity),
        unit_price: form.unit_price ? Number(form.unit_price) : undefined,
        notes: form.notes || undefined,
      });
      setMessage("Sale recorded.");
      setForm((prev) => ({ ...initialForm, store_id: prev.store_id }));
      await loadData();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to record sale.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell title="Sales" subtitle="Log sales and track revenue.">
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
        <h2 className="text-base font-semibold text-[#064E3B]">Record Sale</h2>
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
              placeholder="2"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#6B7280]">
            Unit price (optional)
            <input
              value={form.unit_price}
              onChange={(event) => setForm((prev) => ({ ...prev, unit_price: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              placeholder="150"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#6B7280] md:col-span-2">
            Notes
            <input
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              placeholder="Cash sale"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="md:col-span-3 inline-flex items-center justify-center rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Record Sale
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[#064E3B]">Recent Sales</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[#6B7280]">
                <th className="pb-3">Product</th>
                <th className="pb-3">Qty</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-sm text-[#6B7280]">
                    No sales yet.
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="border-t border-[#D1FAE5]">
                    <td className="py-3">{productMap[sale.product_id] || sale.product_id}</td>
                    <td className="py-3">{sale.quantity}</td>
                    <td className="py-3">KES {Number(sale.total_price).toFixed(2)}</td>
                    <td className="py-3 text-[#6B7280]">
                      {new Date(sale.created_at).toLocaleDateString()}
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
