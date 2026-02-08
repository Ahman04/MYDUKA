/**
 * Purchase orders page.
 * Creates and tracks supplier orders with receiving workflow.
 */
import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import { getStoredUser, productsApi, purchaseOrdersApi, storesApi, suppliersApi } from "../services/api";

const emptyItem = { product_id: "", quantity: "", unit_cost: "", unit_price: "" };

export default function PurchaseOrders() {
  const user = getStoredUser();
  const [stores, setStores] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([emptyItem]);
  const [form, setForm] = useState({ store_id: "", supplier_id: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [storesRes, suppliersRes, productsRes, ordersRes] = await Promise.all([
      storesApi.list({ active_only: true, limit: 100 }),
      suppliersApi.list(),
      productsApi.list({ limit: 200 }),
      purchaseOrdersApi.list(),
    ]);
    setStores(storesRes.data);
    setSuppliers(suppliersRes.data);
    setProducts(productsRes.data);
    setOrders(ordersRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (user?.role === "admin" && user?.store_id) {
      setForm((prev) => ({ ...prev, store_id: user.store_id }));
    }
  }, [user]);

  const totalCost = useMemo(() => {
    return items.reduce((sum, item) => {
      const qty = Number(item.quantity || 0);
      const cost = Number(item.unit_cost || 0);
      return sum + qty * cost;
    }, 0);
  }, [items]);

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await purchaseOrdersApi.create({
        store_id: Number(form.store_id),
        supplier_id: Number(form.supplier_id),
        notes: form.notes || undefined,
        items: items
          .filter((item) => item.product_id && item.quantity)
          .map((item) => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
            unit_cost: Number(item.unit_cost),
            unit_price: item.unit_price ? Number(item.unit_price) : undefined,
          })),
      });
      setMessage("Purchase order created.");
      setItems([emptyItem]);
      setForm((prev) => ({ ...prev, notes: "" }));
      await loadData();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to create purchase order.");
    } finally {
      setBusy(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    setBusy(true);
    setError("");
    try {
      await purchaseOrdersApi.updateStatus(orderId, { status });
      await loadData();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to update order.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell title="Purchase Orders" subtitle="Plan purchasing and receive stock.">
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
        <h2 className="text-base font-semibold text-[#064E3B]">Create Purchase Order</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
              Supplier
              <select
                value={form.supplier_id}
                onChange={(event) => setForm((prev) => ({ ...prev, supplier_id: event.target.value }))}
                className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
                required
              >
                <option value="">Select supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-[#6B7280]">
              Notes
              <input
                value={form.notes}
                onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
                placeholder="Optional notes"
              />
            </label>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={`${index}-${item.product_id}`} className="grid grid-cols-1 gap-3 md:grid-cols-5">
                <select
                  value={item.product_id}
                  onChange={(event) => handleItemChange(index, "product_id", event.target.value)}
                  className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
                >
                  <option value="">Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  value={item.quantity}
                  onChange={(event) => handleItemChange(index, "quantity", event.target.value)}
                  className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
                  placeholder="Qty"
                />
                <input
                  value={item.unit_cost}
                  onChange={(event) => handleItemChange(index, "unit_cost", event.target.value)}
                  className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
                  placeholder="Unit cost"
                />
                <input
                  value={item.unit_price}
                  onChange={(event) => handleItemChange(index, "unit_price", event.target.value)}
                  className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
                  placeholder="Unit price"
                />
                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== index))}
                  className="rounded-lg border border-[#D1FAE5] px-3 py-2 text-sm text-[#DC2626]"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <button
              type="button"
              onClick={() => setItems((prev) => [...prev, emptyItem])}
              className="rounded-lg border border-[#D1FAE5] px-3 py-2 text-[#6B7280]"
            >
              Add item
            </button>
            <span className="font-semibold text-[#064E3B]">Total cost: KES {totalCost.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Create Purchase Order
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[#064E3B]">Recent Purchase Orders</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[#6B7280]">
                <th className="pb-3">Supplier</th>
                <th className="pb-3">Store</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-sm text-[#6B7280]">
                    No purchase orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-t border-[#D1FAE5]">
                    <td className="py-3">{order.supplier_name}</td>
                    <td className="py-3 text-[#6B7280]">{order.store_name}</td>
                    <td className="py-3">KES {Number(order.total_cost).toFixed(2)}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-[#D1FAE5] px-3 py-1 text-xs text-[#15803D]">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        {order.status === "draft" ? (
                          <>
                            <button
                              onClick={() => updateStatus(order.id, "sent")}
                              className="rounded bg-[#D1FAE5] px-2 py-1 text-xs text-[#15803D]"
                            >
                              Send
                            </button>
                            <button
                              onClick={() => updateStatus(order.id, "cancelled")}
                              className="rounded bg-[#DC2626]/10 px-2 py-1 text-xs text-[#DC2626]"
                            >
                              Cancel
                            </button>
                          </>
                        ) : null}
                        {order.status === "sent" ? (
                          <button
                            onClick={() => updateStatus(order.id, "received")}
                            className="rounded bg-[#D1FAE5] px-2 py-1 text-xs text-[#15803D]"
                          >
                            Receive
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
