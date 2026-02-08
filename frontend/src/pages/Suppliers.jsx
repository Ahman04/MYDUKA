/**
 * Suppliers page.
 * Manages supplier contacts and store-level availability.
 */
import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import { getStoredUser, storesApi, suppliersApi } from "../services/api";

const initialForm = {
  store_id: "",
  name: "",
  contact_name: "",
  phone: "",
  email: "",
  address: "",
};

export default function Suppliers() {
  const user = getStoredUser();
  const [stores, setStores] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadStores = async () => {
    const response = await storesApi.list({ active_only: true, limit: 100 });
    setStores(response.data);
  };

  const loadSuppliers = async () => {
    const response = await suppliersApi.list();
    setSuppliers(response.data);
  };

  useEffect(() => {
    loadStores();
    loadSuppliers();
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
      await suppliersApi.create({
        ...form,
        store_id: form.store_id ? Number(form.store_id) : undefined,
      });
      setMessage("Supplier saved.");
      setForm((prev) => ({ ...initialForm, store_id: prev.store_id }));
      await loadSuppliers();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to save supplier.");
    } finally {
      setBusy(false);
    }
  };

  const handleDeactivate = async (supplierId) => {
    setBusy(true);
    setError("");
    try {
      await suppliersApi.update(supplierId, { is_active: false });
      await loadSuppliers();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to update supplier.");
    } finally {
      setBusy(false);
    }
  };

  const storeOptions = stores.map((store) => (
    <option key={store.id} value={store.id}>
      {store.name}
    </option>
  ));

  return (
    <PageShell title="Suppliers" subtitle="Manage supplier contacts and availability.">
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
        <h2 className="text-base font-semibold text-[#064E3B]">Create Supplier</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-1 text-xs text-[#6B7280]">
            Store
            <select
              value={form.store_id}
              onChange={(event) => setForm((prev) => ({ ...prev, store_id: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              disabled={user?.role === "admin"}
            >
              <option value="">Select store</option>
              {storeOptions}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#6B7280]">
            Supplier name
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              placeholder="Fresh Foods Ltd"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#6B7280]">
            Contact name
            <input
              value={form.contact_name}
              onChange={(event) => setForm((prev) => ({ ...prev, contact_name: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              placeholder="Sarah Wanjiku"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#6B7280]">
            Phone
            <input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              placeholder="+254700000111"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#6B7280]">
            Email
            <input
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              placeholder="supplier@email.com"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-[#6B7280] md:col-span-3">
            Address
            <input
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              placeholder="Industrial Area, Nairobi"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="md:col-span-3 inline-flex items-center justify-center rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Save Supplier
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[#064E3B]">Suppliers</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[#6B7280]">
                <th className="pb-3">Name</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Phone</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-sm text-[#6B7280]">
                    No suppliers yet.
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-t border-[#D1FAE5]">
                    <td className="py-3 font-medium">{supplier.name}</td>
                    <td className="py-3 text-[#6B7280]">{supplier.contact_name || "-"}</td>
                    <td className="py-3 text-[#6B7280]">{supplier.phone || "-"}</td>
                    <td className="py-3 text-[#6B7280]">{supplier.email || "-"}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          supplier.is_active
                            ? "bg-[#D1FAE5] text-[#15803D]"
                            : "bg-[#DC2626]/10 text-[#DC2626]"
                        }`}
                      >
                        {supplier.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3">
                      {supplier.is_active ? (
                        <button
                          onClick={() => handleDeactivate(supplier.id)}
                          disabled={busy}
                          className="rounded bg-[#DC2626]/10 px-2 py-1 text-xs text-[#DC2626]"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <span className="text-xs text-[#6B7280]">No action</span>
                      )}
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
