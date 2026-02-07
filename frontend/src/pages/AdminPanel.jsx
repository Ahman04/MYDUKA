/**
 * Store admin dashboard page.
 * Manages clerks, supply request decisions, and supplier payment updates.
 * Includes graphical reports (bar and line charts) per file.txt requirements.
 */
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  ClipboardCheck,
  CreditCard,
  Loader2,
  LogOut,
  Store,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { Card, Table, Badge, Button, Spinner } from "flowbite-react";
import DashboardLayout from "../components/DashboardLayout";
import {
  getStoredUser,
  inventoryApi,
  logoutSession,
  reportApi,
  supplyRequestsApi,
  usersApi,
} from "../services/api";

const EMPTY_DASHBOARD = {
  stats: {
    active_clerks: 0,
    pending_requests: 0,
    unpaid_products: 0,
    store_value: 0,
  },
  supply_requests: [],
  payment_status: [],
  clerks: [],
  clerk_performance: [],
};

const PAGE_SIZE = 6;

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function AdminPanel() {
  const navigate = useNavigate();
  const currentUser = useMemo(() => getStoredUser(), []);
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [requestFilter, setRequestFilter] = useState("All");
  const [requestSearch, setRequestSearch] = useState("");
  const [clerkSearch, setClerkSearch] = useState("");
  const [supplyPage, setSupplyPage] = useState(1);
  const [paymentPaidPage, setPaymentPaidPage] = useState(1);
  const [paymentUnpaidPage, setPaymentUnpaidPage] = useState(1);
  const [clerkPage, setClerkPage] = useState(1);
  const [clerkForm, setClerkForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const filteredSupply = useMemo(() => {
    const query = requestSearch.trim().toLowerCase();
    return dashboard.supply_requests.filter((item) => {
      const matchesStatus = requestFilter === "All" || item.status === requestFilter;
      const matchesQuery =
        !query ||
        item.product.toLowerCase().includes(query) ||
        item.requested_by.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [dashboard.supply_requests, requestFilter, requestSearch]);

  const paidProducts = useMemo(
    () => dashboard.payment_status.filter((p) => p.payment_status?.toLowerCase() === "paid"),
    [dashboard.payment_status]
  );
  const unpaidProducts = useMemo(
    () => dashboard.payment_status.filter((p) => p.payment_status?.toLowerCase() === "unpaid"),
    [dashboard.payment_status]
  );

  const filteredClerks = useMemo(() => {
    const query = clerkSearch.trim().toLowerCase();
    if (!query) return dashboard.clerks;
    return dashboard.clerks.filter(
      (item) =>
        item.name.toLowerCase().includes(query) || item.email.toLowerCase().includes(query)
    );
  }, [dashboard.clerks, clerkSearch]);

  const supplyPages = Math.max(1, Math.ceil(filteredSupply.length / PAGE_SIZE));
  const paidPages = Math.max(1, Math.ceil(paidProducts.length / PAGE_SIZE));
  const unpaidPages = Math.max(1, Math.ceil(unpaidProducts.length / PAGE_SIZE));
  const clerkPages = Math.max(1, Math.ceil(filteredClerks.length / PAGE_SIZE));

  const pagedSupply = filteredSupply.slice((supplyPage - 1) * PAGE_SIZE, supplyPage * PAGE_SIZE);
  const pagedPaidProducts = paidProducts.slice((paymentPaidPage - 1) * PAGE_SIZE, paymentPaidPage * PAGE_SIZE);
  const pagedUnpaidProducts = unpaidProducts.slice((paymentUnpaidPage - 1) * PAGE_SIZE, paymentUnpaidPage * PAGE_SIZE);
  const pagedClerks = filteredClerks.slice((clerkPage - 1) * PAGE_SIZE, clerkPage * PAGE_SIZE);

  const loadDashboard = async () => {
    const response = await reportApi.adminDashboard();
    setDashboard(response.data);
  };

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        await loadDashboard();
      } catch (requestError) {
        if (!active) return;
        const detail = requestError?.response?.data?.detail;
        setError(typeof detail === "string" ? detail : "Failed to load admin dashboard.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => setSupplyPage(1), [requestFilter, requestSearch]);
  useEffect(() => setClerkPage(1), [clerkSearch]);

  const setTemporaryMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2500);
  };

  const handleLogout = async () => {
    await logoutSession();
    navigate("/", { replace: true });
  };

  const handleRequestStatus = async (requestId, action) => {
    setBusyId(`request-${requestId}`);
    setError("");
    try {
      if (action === "approve") {
        await supplyRequestsApi.approve(requestId);
      } else {
        await supplyRequestsApi.decline(requestId, "Declined by admin");
      }
      await loadDashboard();
      setTemporaryMessage(`Request ${action}d successfully.`);
    } catch (requestError) {
      const detail = requestError?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : `Failed to ${action} request.`);
    } finally {
      setBusyId(null);
    }
  };

  const handleTogglePayment = async (item) => {
    setBusyId(`payment-${item.inventory_id}`);
    setError("");
    try {
      const nextStatus = item.payment_status.toLowerCase() === "paid" ? "unpaid" : "paid";
      await inventoryApi.updatePaymentStatus(item.inventory_id, nextStatus);
      await loadDashboard();
      setTemporaryMessage("Payment status updated.");
    } catch (requestError) {
      const detail = requestError?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to update payment status.");
    } finally {
      setBusyId(null);
    }
  };

  const handleClerkStatus = async (clerk, isActive) => {
    setBusyId(`clerk-${clerk.id}`);
    setError("");
    try {
      await usersApi.setActive(clerk.id, isActive);
      await loadDashboard();
      setTemporaryMessage(`Clerk ${isActive ? "activated" : "deactivated"}.`);
    } catch (requestError) {
      const detail = requestError?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to update clerk status.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteClerk = async (clerk) => {
    setBusyId(`delete-${clerk.id}`);
    setError("");
    try {
      await usersApi.remove(clerk.id);
      await loadDashboard();
      setTemporaryMessage("Clerk deleted.");
    } catch (requestError) {
      const detail = requestError?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to delete clerk.");
    } finally {
      setBusyId(null);
    }
  };

  const handleCreateClerk = async (event) => {
    event.preventDefault();
    setBusyId("create-clerk");
    setError("");
    try {
      await usersApi.create({ ...clerkForm, role: "clerk" });
      setClerkForm({ first_name: "", last_name: "", email: "", password: "" });
      await loadDashboard();
      setTemporaryMessage("Clerk created successfully.");
    } catch (requestError) {
      const detail = requestError?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to create clerk.");
    } finally {
      setBusyId(null);
    }
  };

  const statsCards = [
    {
      title: "Active Clerks",
      value: dashboard.stats.active_clerks,
      trend: "Current active users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Pending Requests",
      value: dashboard.stats.pending_requests,
      trend: "Needs review",
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      title: "Unpaid Products",
      value: dashboard.stats.unpaid_products,
      trend: "Payment follow-up",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Store Value",
      value: formatCurrency(dashboard.stats.store_value),
      trend: "Inventory valuation",
      icon: <Store className="h-5 w-5" />,
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[hsl(222,60%,28%)] font-sans">Admin Dashboard</h1>
        {loading ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" color="gray" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Loading admin data...</span>
          </div>
        ) : null}
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {statsCards.map((card) => (
            <Card key={card.title} className="border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">{card.title}</p>
                <span className="rounded-lg bg-[hsl(35,90%,55%)]/20 p-2 text-[hsl(35,90%,45%)]">{card.icon}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="mt-1 text-xs text-slate-500">{card.trend}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Section title="Clerk Performance (Bar Chart)" subtitle="Recorded entries, stock, and spoilt items by clerk.">
            <div className="h-72 rounded-lg bg-slate-50 border border-slate-200 p-4">
              {dashboard.clerk_performance.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-600">
                  No clerk performance data yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard.clerk_performance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#475569" }} />
                    <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0" }} />
                    <Legend />
                    <Bar dataKey="recorded_items" name="Entries" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="total_stock_recorded" name="Stock" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="spoilt_recorded" name="Spoilt" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Section>
          <Section title="Individual Entry Performance (Line Chart)" subtitle="Recorded entries trend across clerks.">
            <div className="h-72 rounded-lg bg-slate-50 border border-slate-200 p-4">
              {dashboard.clerk_performance.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-600">
                  No performance data yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboard.clerk_performance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#475569" }} />
                    <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0" }} />
                    <Legend />
                    <Line type="monotone" dataKey="recorded_items" name="Entries" stroke="#63C2B0" strokeWidth={2} dot={{ fill: "#63C2B0" }} />
                    <Line type="monotone" dataKey="total_stock_recorded" name="Stock" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6" }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Section>
        </div>

        <Section title="Register Clerk" subtitle="Create data-entry clerk accounts assigned to your store.">
          <form onSubmit={handleCreateClerk} className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              placeholder="First name"
              value={clerkForm.first_name}
              onChange={(e) => setClerkForm((prev) => ({ ...prev, first_name: e.target.value }))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
              required
            />
            <input
              placeholder="Last name"
              value={clerkForm.last_name}
              onChange={(e) => setClerkForm((prev) => ({ ...prev, last_name: e.target.value }))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
              required
            />
            <input
              type="email"
              placeholder="clerk@myduka.com"
              value={clerkForm.email}
              onChange={(e) => setClerkForm((prev) => ({ ...prev, email: e.target.value }))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
              required
            />
            <input
              placeholder="Password"
              value={clerkForm.password}
              onChange={(e) => setClerkForm((prev) => ({ ...prev, password: e.target.value }))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
              minLength={8}
              required
            />
            <button
              type="submit"
              disabled={busyId === "create-clerk"}
              className="md:col-span-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(222,60%,28%)] px-4 py-2 text-sm font-semibold text-white hover:bg-[hsl(222,60%,24%)]"
            >
              <UserPlus className="h-4 w-4" />
              {busyId === "create-clerk" ? "Creating..." : "Create Clerk"}
            </button>
          </form>
        </Section>

        <Section title="Supply Requests" subtitle="Review and approve stock refill requests.">
          <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              value={requestSearch}
              onChange={(e) => setRequestSearch(e.target.value)}
              placeholder="Search product/clerk"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
            />
            <select
              value={requestFilter}
              onChange={(e) => setRequestFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Declined</option>
            </select>
          </div>
          <DataTable
            headers={["Product", "Quantity", "Requested By", "Date", "Notes", "Status", "Actions"]}
            rows={pagedSupply}
            renderRow={(item) => (
              <tr key={item.id} className="border-t border-slate-200">
                <td className="py-3">{item.product}</td>
                <td className="py-3">{item.quantity}</td>
                <td className="py-3">{item.requested_by}</td>
                <td className="py-3">{formatDate(item.date)}</td>
                <td className="py-3">{item.notes || "-"}</td>
                <td className="py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-3">
                  {item.status === "Pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRequestStatus(item.id, "approve")}
                        disabled={busyId === `request-${item.id}`}
                        className="rounded bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRequestStatus(item.id, "decline")}
                        disabled={busyId === `request-${item.id}`}
                        className="rounded bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-200"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-600">No action</span>
                  )}
                </td>
              </tr>
            )}
            emptyMessage="No supply requests at the moment."
          />
          <Pager page={supplyPage} totalPages={supplyPages} onChange={setSupplyPage} />
        </Section>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Section title="Paid Products" subtitle="Products suppliers have been paid for. Well separated for ease of viewing.">
            <DataTable
              headers={["Product", "Stock", "Buy Price", "Actions"]}
              rows={pagedPaidProducts}
              renderRow={(item) => (
                <tr key={item.inventory_id} className="border-t border-slate-200">
                  <td className="py-3">{item.product}</td>
                  <td className="py-3">{item.stock}</td>
                  <td className="py-3">{formatCurrency(item.buy_price)}</td>
                  <td className="py-3">
                    <button
                      onClick={() => handleTogglePayment(item)}
                      disabled={busyId === `payment-${item.inventory_id}`}
                      className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-[hsl(222,60%,28%)] hover:bg-slate-200"
                    >
                      Mark Unpaid
                    </button>
                  </td>
                </tr>
              )}
              emptyMessage="No paid products yet."
            />
            <Pager page={paymentPaidPage} totalPages={paidPages} onChange={setPaymentPaidPage} />
          </Section>
          <Section title="Unpaid Products" subtitle="Products pending supplier payment. Change status once paid.">
            <DataTable
              headers={["Product", "Stock", "Buy Price", "Actions"]}
              rows={pagedUnpaidProducts}
              renderRow={(item) => (
                <tr key={item.inventory_id} className="border-t border-slate-200">
                  <td className="py-3">{item.product}</td>
                  <td className="py-3">{item.stock}</td>
                  <td className="py-3">{formatCurrency(item.buy_price)}</td>
                  <td className="py-3">
                    <button
                      onClick={() => handleTogglePayment(item)}
                      disabled={busyId === `payment-${item.inventory_id}`}
                      className="rounded bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-200"
                    >
                      Mark Paid
                    </button>
                  </td>
                </tr>
              )}
              emptyMessage="No unpaid products."
            />
            <Pager page={paymentUnpaidPage} totalPages={unpaidPages} onChange={setPaymentUnpaidPage} />
          </Section>
        </div>

        <Section title="Clerk Management" subtitle="View assigned clerks and account status.">
          <div className="mb-3">
            <input
              value={clerkSearch}
              onChange={(e) => setClerkSearch(e.target.value)}
              placeholder="Search clerk name or email"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 md:w-80"
            />
          </div>
          <DataTable
            headers={["Name", "Email", "Joined", "Status", "Actions"]}
            rows={pagedClerks}
            renderRow={(item) => (
              <tr key={item.id} className="border-t border-slate-200">
                <td className="py-3">{item.name}</td>
                <td className="py-3 text-slate-600">{item.email}</td>
                <td className="py-3">{formatDate(item.joined_date)}</td>
                <td className="py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    {item.status === "Active" ? (
                      <button
                        onClick={() => handleClerkStatus(item, false)}
                        disabled={busyId === `clerk-${item.id}`}
                        className="rounded bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-200"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleClerkStatus(item, true)}
                        disabled={busyId === `clerk-${item.id}`}
                        className="rounded bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-200"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClerk(item)}
                      disabled={busyId === `delete-${item.id}`}
                      className="rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )}
            emptyMessage="No clerks found for this admin."
          />
          <Pager page={clerkPage} totalPages={clerkPages} onChange={setClerkPage} />
        </Section>

        <Section title="Clerk Performance" subtitle="Performance summary for reporting.">
          <DataTable
            headers={["Clerk", "Recorded Entries", "Stock Recorded", "Spoilt Recorded"]}
            rows={dashboard.clerk_performance}
            renderRow={(item) => (
              <tr key={item.clerk_id} className="border-t border-slate-200">
                <td className="py-3">{item.name}</td>
                <td className="py-3">{item.recorded_items}</td>
                <td className="py-3">{item.total_stock_recorded}</td>
                <td className="py-3">{item.spoilt_recorded}</td>
              </tr>
            )}
            emptyMessage="No clerk performance data yet."
          />
        </Section>
      </div>
    </DashboardLayout>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <h2 className="text-lg font-semibold text-[hsl(222,60%,28%)]">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

function DataTable({ headers, rows, renderRow, emptyMessage }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-sm">
        <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
            {headers.map((header) => (
              <th key={header} className="pb-3 pr-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="py-6 text-sm text-slate-600">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map(renderRow)
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const palette = {
    Pending: "bg-amber-100 text-amber-800",
    Approved: "bg-emerald-100 text-emerald-800",
    Declined: "bg-rose-100 text-rose-800",
    Paid: "bg-emerald-100 text-emerald-800",
    Unpaid: "bg-rose-100 text-rose-800",
    Active: "bg-emerald-100 text-emerald-800",
    Inactive: "bg-slate-200 text-slate-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${palette[status] || "bg-slate-200 text-slate-700"}`}>
      {status}
    </span>
  );
}

function Pager({ page, totalPages, onChange }) {
  return (
    <div className="mt-3 flex items-center justify-end gap-2 text-xs text-slate-600">
      <button
        onClick={() => onChange((prev) => Math.max(1, prev - 1))}
        disabled={page <= 1}
        className="rounded border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
      >
        Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onChange((prev) => Math.min(totalPages, prev + 1))}
        disabled={page >= totalPages}
        className="rounded border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
