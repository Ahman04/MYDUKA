/**
 * Merchant dashboard page.
 * Provides multi-store reporting, admin lifecycle actions, and invite-link onboarding.
 */
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Building2,
  ChevronDown,
  Copy,
  Download,
  Loader2,
  LogOut,
  MailPlus,
  Store,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardLayout from "../components/DashboardLayout";
import {
  getStoredUser,
  inventoryApi,
  logoutSession,
  productsApi,
  reportApi,
  usersApi,
} from "../services/api";

const EMPTY_DATA = {
  stats: {
    active_stores: 0,
    active_admins: 0,
    total_products: 0,
    estimated_revenue: 0,
  },
  performance: [],
  payment_summary: {
    paid_amount: 0,
    unpaid_amount: 0,
    paid_percentage: 0,
    unpaid_percentage: 0,
  },
  stores: [],
  admins: [],
};

const PAGE_SIZE = 6;

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount || 0);

export default function MerchantDashboard() {
  const navigate = useNavigate();
  const currentUser = useMemo(() => getStoredUser(), []);
  const [dashboard, setDashboard] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [inviteForm, setInviteForm] = useState({ email: "", store_id: "" });
  const [latestInvite, setLatestInvite] = useState("");
  const [adminSearch, setAdminSearch] = useState("");
  const [adminPage, setAdminPage] = useState(1);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const filteredAdmins = useMemo(() => {
    const query = adminSearch.trim().toLowerCase();
    if (!query) return dashboard.admins;
    return dashboard.admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query) ||
        (admin.store || "").toLowerCase().includes(query)
    );
  }, [dashboard.admins, adminSearch]);

  const adminPages = Math.max(1, Math.ceil(filteredAdmins.length / PAGE_SIZE));
  const pagedAdmins = filteredAdmins.slice((adminPage - 1) * PAGE_SIZE, adminPage * PAGE_SIZE);

  const loadDashboard = async () => {
    const response = await reportApi.merchantDashboard();
    setDashboard(response.data);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        await loadDashboard();
      } catch (requestError) {
        if (!active) return;
        const detail = requestError?.response?.data?.detail;
        setError(typeof detail === "string" ? detail : "Failed to load merchant dashboard.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => setAdminPage(1), [adminSearch]);

  const setTemporaryMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2500);
  };

  const handleLogout = async () => {
    await logoutSession();
    navigate("/", { replace: true });
  };

  const handleInviteAdmin = async (event) => {
    event.preventDefault();
    setBusyId("invite");
    setError("");
    try {
      const payload = {
        email: inviteForm.email,
        store_id: inviteForm.store_id ? Number(inviteForm.store_id) : null,
      };
      const response = await usersApi.createAdminInvite(payload);
      setLatestInvite(response.data.invite_link);
      setMessage("Invite link generated.");
      setInviteForm({ email: "", store_id: "" });
    } catch (requestError) {
      const detail = requestError?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to create admin invite.");
    } finally {
      setBusyId(null);
    }
  };

  const handleAdminStatus = async (admin, isActive) => {
    setBusyId(`admin-${admin.id}`);
    setError("");
    try {
      await usersApi.setActive(admin.id, isActive);
      await loadDashboard();
      setTemporaryMessage(`Admin ${isActive ? "activated" : "deactivated"}.`);
    } catch (requestError) {
      const detail = requestError?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to update admin status.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteAdmin = async (admin) => {
    setBusyId(`delete-${admin.id}`);
    setError("");
    try {
      await usersApi.remove(admin.id);
      await loadDashboard();
      setTemporaryMessage("Admin deleted.");
    } catch (requestError) {
      const detail = requestError?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to delete admin.");
    } finally {
      setBusyId(null);
    }
  };

  const copyInviteLink = async () => {
    if (!latestInvite) return;
    await navigator.clipboard.writeText(latestInvite);
    setTemporaryMessage("Invite link copied to clipboard.");
  };

  const exportCsv = () => {
    const rows = [
      ["Section", "Name", "Value", "Extra"],
      ["Stats", "Active Stores", dashboard.stats.active_stores, ""],
      ["Stats", "Active Admins", dashboard.stats.active_admins, ""],
      ["Stats", "Total Products", dashboard.stats.total_products, ""],
      ["Stats", "Estimated Revenue", dashboard.stats.estimated_revenue, ""],
      ...dashboard.stores.map((store) => [
        "Store",
        store.name,
        store.sales_total,
        `paid=${store.paid_total}; unpaid=${store.unpaid_total}`,
      ]),
      ...dashboard.performance.map((item) => ["Product Performance", item.product, item.sales, `profit=${item.profit}`]),
    ];

    const csv = rows
      .map((row) => row.map((col) => `"${String(col).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "myduka-merchant-report.csv");
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    {
      label: "Active Stores",
      value: dashboard.stats.active_stores,
      icon: <Store className="h-5 w-5" />,
      color: "text-cyan-300",
    },
    {
      label: "Active Admins",
      value: dashboard.stats.active_admins,
      icon: <Users className="h-5 w-5" />,
      color: "text-emerald-300",
    },
    {
      label: "Total Products",
      value: dashboard.stats.total_products,
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-violet-300",
    },
    {
      label: "Estimated Revenue",
      value: formatCurrency(dashboard.stats.estimated_revenue),
      icon: <Wallet className="h-5 w-5" />,
      color: "text-amber-300",
    },
  ];

  const paymentChartData = [
    {
      name: "Paid",
      value: Number(dashboard.payment_summary.paid_percentage || 0).toFixed(2),
      amount: dashboard.payment_summary.paid_amount,
      color: "#10B981",
    },
    {
      name: "Unpaid",
      value: Number(dashboard.payment_summary.unpaid_percentage || 0).toFixed(2),
      amount: dashboard.payment_summary.unpaid_amount,
      color: "#F43F5E",
    },
  ];

  return (
    <DashboardLayout role="merchant">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[hsl(222,60%,28%)] font-sans">Merchant Dashboard</h1>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-[hsl(222,60%,28%)] hover:bg-slate-50 shadow-sm"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
        {loading ? (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-[hsl(222,60%,28%)]" />
            Loading merchant reports...
          </div>
        ) : null}
        {error ? (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">{stat.label}</p>
                <span className={`rounded-lg bg-slate-100 p-2 ${stat.color}`}>{stat.icon}</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-slate-800">{stat.value}</p>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Admin Invite Links</h2>
          <p className="mt-1 text-sm text-slate-800/65">Create tokenized invite links for new store admins.</p>
          <form onSubmit={handleInviteAdmin} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              type="email"
              placeholder="new-admin@myduka.com"
              className="rounded-lg border border-slate-200 bg-white text-slate-800 px-3 py-2 text-sm"
              value={inviteForm.email}
              onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <select
              value={inviteForm.store_id}
              onChange={(e) => setInviteForm((prev) => ({ ...prev, store_id: e.target.value }))}
              className="rounded-lg border border-slate-200 bg-white text-slate-800 px-3 py-2 text-sm"
            >
              <option value="">Assign store (optional)</option>
              {dashboard.stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={busyId === "invite"}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(222,60%,28%)] hover:bg-[hsl(222,60%,24%)] px-4 py-2 text-sm font-semibold text-white"
            >
              <MailPlus className="h-4 w-4" />
              {busyId === "invite" ? "Creating..." : "Create Invite"}
            </button>
          </form>
          {latestInvite ? (
            <div className="mt-4 rounded-lg border border-slate-200 bg-white text-slate-800 p-3 text-sm">
              <p className="break-all text-slate-600">{latestInvite}</p>
              <button
                onClick={copyInviteLink}
                className="mt-2 inline-flex items-center gap-2 rounded bg-slate-100 px-3 py-1.5 text-xs"
              >
                <Copy className="h-3 w-3" />
                Copy invite link
              </button>
            </div>
          ) : null}
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-800">Product Performance</h2>
            <div className="mt-4 h-72 rounded-lg bg-slate-50 p-2">
              {dashboard.performance.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-600">
                  No performance data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard.performance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="product" tick={{ fontSize: 12, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#475569" }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" name="Sales (KES)" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="profit" name="Profit (KES)" fill="#10B981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-800">Payment Status Overview</h2>
            <div className="mt-4 grid grid-cols-1 items-center gap-6 md:grid-cols-2">
              <div className="h-56 rounded-lg bg-slate-50 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentChartData} dataKey="value" outerRadius={86} paddingAngle={2}>
                      {paymentChartData.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 text-sm">
                {paymentChartData.map((item) => (
                  <div key={item.name} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-slate-600">
                      {item.name} ({item.value}%)
                    </p>
                    <p className="text-lg font-semibold" style={{ color: item.color }}>
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800">Store-by-Store Performance</h2>
          <p className="mt-1 text-sm text-slate-800/65">Click a store to see individual performance, product breakdown, and paid/unpaid items.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {dashboard.stores.length === 0 ? (
              <p className="text-sm text-slate-800/65">No stores available yet.</p>
            ) : (
              dashboard.stores.map((store) => (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => setSelectedStoreId(store.id)}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-[hsl(35,90%,55%)] hover:bg-slate-50 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-800">{store.name}</h3>
                    <div className="flex items-center gap-1">
                      <StatusBadge status={store.status} />
                      <ChevronDown className="h-4 w-4 rotate-[-90deg] text-slate-600" />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{store.location}</p>
                  <p className="mt-2 text-xs text-slate-600">Admin: {store.admin_name || "Unassigned"}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <Metric label="Sales" value={formatCurrency(store.sales_total)} />
                    <Metric label="Paid" value={formatCurrency(store.paid_total)} />
                    <Metric label="Unpaid" value={formatCurrency(store.unpaid_total)} />
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-800">Admin Management</h2>
            <input
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Search admin"
              className="w-56 rounded-lg border border-slate-200 bg-white text-slate-800 px-3 py-1.5 text-xs"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-600">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Store</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-slate-800/65">
                      No admins found.
                    </td>
                  </tr>
                ) : (
                  pagedAdmins.map((admin) => (
                    <tr key={admin.id} className="border-t border-slate-200">
                      <td className="px-6 py-4 font-medium text-slate-800">{admin.name}</td>
                      <td className="px-6 py-4 text-slate-600">{admin.email}</td>
                      <td className="px-6 py-4 text-slate-600">{admin.store || "Unassigned"}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={admin.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {admin.status === "Active" ? (
                            <button
                              onClick={() => handleAdminStatus(admin, false)}
                              disabled={busyId === `admin-${admin.id}`}
                              className="rounded bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-200"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAdminStatus(admin, true)}
                              disabled={busyId === `admin-${admin.id}`}
                              className="rounded bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-200"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAdmin(admin)}
                            disabled={busyId === `delete-${admin.id}`}
                            className="rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pager page={adminPage} totalPages={adminPages} onChange={setAdminPage} />
        </section>

          {selectedStoreId ? (
          <StoreDetailModal
            storeId={selectedStoreId}
            store={dashboard.stores.find((s) => s.id === selectedStoreId)}
            onClose={() => setSelectedStoreId(null)}
            formatCurrency={formatCurrency}
          />
        ) : null}
      </div>
    </DashboardLayout>
  );
}

function StoreDetailModal({ storeId, store, onClose, formatCurrency }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paidItems, setPaidItems] = useState([]);
  const [unpaidItems, setUnpaidItems] = useState([]);
  const [productNames, setProductNames] = useState({});

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [paidRes, unpaidRes, productsRes] = await Promise.all([
          inventoryApi.getPaidByStore(storeId),
          inventoryApi.getUnpaidByStore(storeId),
          productsApi.list({ limit: 500 }),
        ]);
        if (!active) return;
        setPaidItems(paidRes.data || []);
        setUnpaidItems(unpaidRes.data || []);
        const map = {};
        (productsRes.data || []).forEach((p) => {
          map[p.id] = p.name;
        });
        setProductNames(map);
      } catch (err) {
        if (!active) return;
        const detail = err?.response?.data?.detail;
        setError(typeof detail === "string" ? detail : "Failed to load store details.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [storeId]);

  const productPerformance = useMemo(() => {
    const combined = [...paidItems, ...unpaidItems];
    const byProduct = {};
    combined.forEach((inv) => {
      const name = productNames[inv.product_id] || `Product #${inv.product_id}`;
      if (!byProduct[name]) {
        byProduct[name] = { product: name, sales: 0, profit: 0 };
      }
      const sales = inv.quantity_in_stock * (inv.selling_price || 0);
      const cost = inv.quantity_in_stock * (inv.buying_price || 0);
      byProduct[name].sales += sales;
      byProduct[name].profit += sales - cost;
    });
    return Object.values(byProduct).sort((a, b) => b.sales - a.sales).slice(0, 10);
  }, [paidItems, unpaidItems, productNames]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {store?.name || "Store"} — Individual Performance
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center gap-2 py-12">
              <Loader2 className="h-5 w-5 animate-spin text-[hsl(222,60%,28%)]" />
              <span className="text-sm text-slate-600">Loading store details...</span>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : (
            <>
              <div className="mb-6 h-64 rounded-xl bg-slate-50 border border-slate-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-800">Product Performance (Individual)</h3>
                {productPerformance.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-600">
                    No product data for this store.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                      <XAxis dataKey="product" tick={{ fontSize: 10, fill: "#475569" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#475569" }} />
                      <Tooltip formatter={(v) => formatCurrency(v)} />
                      <Legend />
                      <Bar dataKey="sales" name="Sales (KES)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="profit" name="Profit (KES)" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-emerald-700">Paid Products</h3>
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50">
                    {paidItems.length === 0 ? (
                      <p className="p-4 text-sm text-slate-600">No paid products.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-left text-xs text-slate-600">
                            <th className="px-3 py-2">Product</th>
                            <th className="px-3 py-2">Stock</th>
                            <th className="px-3 py-2">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paidItems.map((inv) => (
                            <tr key={inv.id} className="border-t border-slate-200">
                              <td className="px-3 py-2">{productNames[inv.product_id] || `#${inv.product_id}`}</td>
                              <td className="px-3 py-2">{inv.quantity_in_stock}</td>
                              <td className="px-3 py-2">{formatCurrency(inv.quantity_in_stock * inv.buying_price)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-rose-700">Unpaid Products</h3>
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50">
                    {unpaidItems.length === 0 ? (
                      <p className="p-4 text-sm text-slate-600">No unpaid products.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-left text-xs text-slate-600">
                            <th className="px-3 py-2">Product</th>
                            <th className="px-3 py-2">Stock</th>
                            <th className="px-3 py-2">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {unpaidItems.map((inv) => (
                            <tr key={inv.id} className="border-t border-slate-200">
                              <td className="px-3 py-2">{productNames[inv.product_id] || `#${inv.product_id}`}</td>
                              <td className="px-3 py-2">{inv.quantity_in_stock}</td>
                              <td className="px-3 py-2">{formatCurrency(inv.quantity_in_stock * inv.buying_price)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const classes =
    status === "Active"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-slate-200 text-slate-700";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>{status}</span>;
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2">
      <p className="text-[10px] text-slate-600">{label}</p>
      <p className="mt-1 text-xs font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function Pager({ page, totalPages, onChange }) {
  return (
    <div className="flex items-center justify-end gap-2 px-6 py-3 text-xs text-slate-600">
      <button
        onClick={() => onChange((prev) => Math.max(1, prev - 1))}
        disabled={page <= 1}
        className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
      >
        Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onChange((prev) => Math.min(totalPages, prev + 1))}
        disabled={page >= totalPages}
        className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
