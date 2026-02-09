/**
 * Merchant dashboard page.
 * Provides multi-store reporting, admin lifecycle actions, and invite-link onboarding.
 */
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Copy,
  Download,
  Loader2,
  MailPlus,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import PageShell from "../components/PageShell";
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
import { reportApi, usersApi } from "../services/api";

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
  const [dashboard, setDashboard] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [inviteForm, setInviteForm] = useState({ email: "", store_id: "" });
  const [latestInvite, setLatestInvite] = useState("");
  const [latestInviteExpiry, setLatestInviteExpiry] = useState(null);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminPage, setAdminPage] = useState(1);

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
      setLatestInviteExpiry(response.data.expires_in_hours || null);
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
    const nextAction = isActive ? "activate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${nextAction} ${admin.name}?`)) {
      return;
    }
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
    if (!window.confirm(`Delete ${admin.name}? This cannot be undone.`)) {
      return;
    }
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
      color: "text-[#15803D]",
    },
    {
      label: "Active Admins",
      value: dashboard.stats.active_admins,
      icon: <Users className="h-5 w-5" />,
      color: "text-[#15803D]",
    },
    {
      label: "Total Products",
      value: dashboard.stats.total_products,
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-[#15803D]",
    },
    {
      label: "Estimated Revenue",
      value: formatCurrency(dashboard.stats.estimated_revenue),
      icon: <Wallet className="h-5 w-5" />,
      color: "text-[#15803D]",
    },
  ];

  const paymentChartData = [
    {
      name: "Paid",
      value: Number(dashboard.payment_summary.paid_percentage || 0).toFixed(2),
      amount: dashboard.payment_summary.paid_amount,
      color: "#15803D",
    },
    {
      name: "Unpaid",
      value: Number(dashboard.payment_summary.unpaid_percentage || 0).toFixed(2),
      amount: dashboard.payment_summary.unpaid_amount,
      color: "#DC2626",
    },
  ];

  return (
    <PageShell title="Merchant Dashboard" subtitle="Multi-store oversight and profitability insights.">
      <div className="flex justify-end">
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-lg border border-[#D1FAE5] px-3 py-1.5 text-xs text-[#6B7280] hover:bg-[#D1FAE5]"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>
        {loading ? (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#D1FAE5] bg-white px-4 py-3 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-[#34D399]" />
            Loading merchant reports...
          </div>
        ) : null}
        {error ? (
          <div className="mb-6 rounded-xl border border-[#DC2626]/30 bg-[#DC2626]/10 px-4 py-3 text-sm text-[#DC2626]">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="mb-6 rounded-xl border border-[#D1FAE5] bg-[#D1FAE5] px-4 py-3 text-sm text-[#15803D]">
            {message}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-[#D1FAE5] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6B7280]">{stat.label}</p>
                <span className={`rounded-lg bg-[#D1FAE5] p-2 ${stat.color}`}>{stat.icon}</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-[#064E3B]">{stat.value}</p>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-xl border border-[#D1FAE5] bg-white p-5">
          <h2 className="text-lg font-semibold">Admin Invite Links</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Create tokenized invite links for new store admins.</p>
          <form onSubmit={handleInviteAdmin} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              type="email"
              placeholder="new-admin@myduka.com"
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
              value={inviteForm.email}
              onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <select
              value={inviteForm.store_id}
              onChange={(e) => setInviteForm((prev) => ({ ...prev, store_id: e.target.value }))}
              className="rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2 text-sm"
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
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white"
            >
              <MailPlus className="h-4 w-4" />
              {busyId === "invite" ? "Creating..." : "Create Invite"}
            </button>
          </form>
          {latestInvite ? (
            <div className="mt-4 rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] p-3 text-sm">
              <p className="break-all text-[#6B7280]">{latestInvite}</p>
              {latestInviteExpiry ? (
                <p className="mt-2 text-xs text-[#6B7280]">
                  Expires in {latestInviteExpiry} hours.
                </p>
              ) : null}
              <button
                onClick={copyInviteLink}
                className="mt-2 inline-flex items-center gap-2 rounded bg-[#D1FAE5] px-3 py-1.5 text-xs"
              >
                <Copy className="h-3 w-3" />
                Copy invite link
              </button>
            </div>
          ) : null}
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#064E3B]">Product Performance</h2>
            <div className="mt-4 h-72 rounded-lg bg-white p-2">
              {dashboard.performance.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-[#6B7280]">
                  No performance data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard.performance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D1FAE5" />
                    <XAxis dataKey="product" tick={{ fontSize: 12, fill: "#064E3B" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#064E3B" }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" name="Sales (KES)" fill="#15803D" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="profit" name="Profit (KES)" fill="#34D399" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#064E3B]">Payment Status Overview</h2>
            <div className="mt-4 grid grid-cols-1 items-center gap-6 md:grid-cols-2">
              <div className="h-56 rounded-lg bg-white p-2">
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
                  <div key={item.name} className="rounded-lg border border-[#D1FAE5] bg-white p-3">
                    <p className="text-[#6B7280]">
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

        <section className="mt-8 rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-[#064E3B]">Store-by-Store Performance</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {dashboard.stores.length === 0 ? (
              <p className="text-sm text-[#6B7280]">No stores available yet.</p>
            ) : (
              dashboard.stores.map((store) => (
                <div key={store.id} className="rounded-xl border border-[#D1FAE5] bg-white p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[#064E3B]">{store.name}</h3>
                    <StatusBadge status={store.status} />
                  </div>
                  <p className="mt-1 text-xs text-[#6B7280]">{store.location}</p>
                  <p className="mt-2 text-xs text-[#6B7280]">Admin: {store.admin_name || "Unassigned"}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <Metric label="Sales" value={formatCurrency(store.sales_total)} />
                    <Metric label="Paid" value={formatCurrency(store.paid_total)} />
                    <Metric label="Unpaid" value={formatCurrency(store.unpaid_total)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-[#D1FAE5] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#D1FAE5] px-6 py-4">
            <h2 className="text-base font-semibold text-[#064E3B]">Admin Management</h2>
            <input
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Search admin"
              className="w-56 rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-1.5 text-xs"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-[#6B7280]">
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
                    <td colSpan={5} className="px-6 py-6 text-[#6B7280]">
                      No admins found.
                    </td>
                  </tr>
                ) : (
                  pagedAdmins.map((admin) => (
                    <tr key={admin.id} className="border-t border-[#D1FAE5]">
                      <td className="px-6 py-4 font-medium text-[#064E3B]">{admin.name}</td>
                      <td className="px-6 py-4 text-[#6B7280]">{admin.email}</td>
                      <td className="px-6 py-4 text-[#6B7280]">{admin.store || "Unassigned"}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={admin.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {admin.status === "Active" ? (
                            <button
                              onClick={() => handleAdminStatus(admin, false)}
                              disabled={busyId === `admin-${admin.id}`}
                              className="rounded bg-[#DC2626]/10 px-2 py-1 text-xs text-[#DC2626]"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAdminStatus(admin, true)}
                              disabled={busyId === `admin-${admin.id}`}
                              className="rounded bg-[#D1FAE5] px-2 py-1 text-xs text-[#15803D]"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAdmin(admin)}
                            disabled={busyId === `delete-${admin.id}`}
                            className="rounded bg-[#DC2626]/10 px-2 py-1 text-xs text-[#DC2626]"
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
    </PageShell>
  );
}

function StatusBadge({ status }) {
  const classes =
    status === "Active"
      ? "bg-[#D1FAE5] text-[#15803D]"
      : "bg-[#D1FAE5] text-[#6B7280]";
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${classes}`}>{status}</span>;
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-[#D1FAE5] bg-white p-2">
      <p className="text-[10px] text-[#6B7280]">{label}</p>
      <p className="mt-1 text-xs font-semibold text-[#064E3B]">{value}</p>
    </div>
  );
}

function Pager({ page, totalPages, onChange }) {
  return (
    <div className="flex items-center justify-end gap-2 px-6 py-3 text-xs text-[#6B7280]">
      <button
        onClick={() => onChange((prev) => Math.max(1, prev - 1))}
        disabled={page <= 1}
        className="rounded border border-[#D1FAE5] px-2 py-1 disabled:opacity-40"
      >
        Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onChange((prev) => Math.min(totalPages, prev + 1))}
        disabled={page >= totalPages}
        className="rounded border border-[#D1FAE5] px-2 py-1 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
