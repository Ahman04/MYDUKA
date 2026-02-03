import {
  BarChart3,
  Building2,
  LogOut,
  Store,
  Users,
  Wallet,
} from "lucide-react";
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

export default function MerchantDashboard() {
  const stats = [
    {
      label: "Active Stores",
      value: "2",
      trend: "+2 this month",
      icon: <Store className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Admins",
      value: "2",
      trend: "+1 this month",
      icon: <Users className="h-5 w-5" />,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Products",
      value: "5",
      trend: "",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Est. Revenue",
      value: "KES 191.8K",
      trend: "+12% this week",
      icon: <Wallet className="h-5 w-5" />,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const performanceData = [
    { name: "Rice", sales: 85000, profit: 18000 },
    { name: "Cooking Oil", sales: 30000, profit: 8000 },
    { name: "Sugar", sales: 48000, profit: 12000 },
    { name: "Maize Flour", sales: 25000, profit: 7000 },
    { name: "Wheat Flour", sales: 20000, profit: 5000 },
  ];

  const paymentData = [
    { name: "Paid", value: 74, amount: "KES 156,800", color: "#63C2B0" },
    { name: "Unpaid", value: 26, amount: "KES 54,200", color: "#63C2B0" },
  ];

  const stores = [
    {
      name: "Downtown Store",
      location: "Downtown, Nairobi",
      admin: "Jane Admin",
      status: "Active",
    },
    {
      name: "Westlands Branch",
      location: "Westlands, Nairobi",
      admin: "Peter Admin",
      status: "Active",
    },
    {
      name: "Industrial Area",
      location: "Industrial Area, Nairobi",
      admin: "Sarah Admin",
      status: "Inactive",
    },
  ];

  const admins = [
    {
      name: "Jane Admin",
      email: "jane@myduka.com",
      store: "Downtown Store",
      status: "Active",
    },
    {
      name: "Peter Admin",
      email: "peter@myduka.com",
      store: "Westlands Branch",
      status: "Active",
    },
    {
      name: "Sarah Admin",
      email: "sarah@myduka.com",
      store: "Industrial Area",
      status: "Inactive",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <header className="border-b border-[#1E293B] bg-[#1E293B]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E293B] text-[#E2E8F0]">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-[#E2E8F0]">MyDuka</h1>
              <p className="text-xs text-[#E2E8F0]/70">Merchant Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-[#E2E8F0]/70">
            <div className="text-right">
              John Merchant <span className="block text-xs">Merchant</span>
            </div>
            <button className="rounded-full border border-[#1E293B] p-2 text-[#E2E8F0]/70 hover:text-[#E2E8F0]">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 text-[#E2E8F0]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#1E293B] bg-[#1E293B] p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#E2E8F0]/70">{stat.label}</p>
                <span className="rounded-lg bg-[#1E293B] p-2 text-[#63C2B0]">
                  {stat.icon}
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-[#63C2B0]">
                {stat.value}
              </p>
              {stat.trend ? (
                <p className="mt-1 text-xs text-[#E2E8F0]/60">{stat.trend}</p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[#1E293B] bg-[#1E293B] p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#E2E8F0]">
              Product Performance
            </h2>
            <div className="mt-4 h-64 rounded-lg bg-[#1E293B] p-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#E2E8F0" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#E2E8F0" }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" name="Expense (KES)" fill="#63C2B0" />
                  <Bar dataKey="profit" name="Profit (KES)" fill="#63C2B0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-[#1E293B] bg-[#1E293B] p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#E2E8F0]">
              Payment Status Overview
            </h2>
            <div className="mt-4 grid grid-cols-1 items-center gap-6 md:grid-cols-2">
              <div className="h-48 rounded-lg bg-[#1E293B] p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      dataKey="value"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {paymentData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 text-sm">
                {paymentData.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: item.color }}
                    />
                    <div>
                      <p className="text-[#E2E8F0]/70">{item.name}</p>
                      <p
                        className={`text-base font-semibold ${
                          item.name === "Paid"
                            ? "text-[#63C2B0]"
                            : "text-[#63C2B0]"
                        }`}
                      >
                        {item.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-[#1E293B] bg-[#1E293B] p-6 shadow-sm">
          <h2 className="text-base font-semibold text-[#E2E8F0]">
            Store Management
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {stores.map((store) => (
              <div
                key={store.name}
                className="rounded-xl border border-[#1E293B] bg-[#1E293B] p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#E2E8F0]">
                    {store.name}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      store.status === "Active"
                        ? "bg-[#1E293B] text-[#63C2B0]"
                        : "bg-[#1E293B] text-[#63C2B0]"
                    }`}
                  >
                    {store.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#E2E8F0]/70">{store.location}</p>
                <p className="mt-2 text-xs text-[#E2E8F0]/60">
                  Admin: {store.admin}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-[#1E293B] bg-[#1E293B] shadow-sm">
          <div className="border-b border-[#1E293B] px-6 py-4">
            <h2 className="text-base font-semibold text-[#E2E8F0]">
              Admin Management
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-[#E2E8F0]/60">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Store</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.email} className="border-t border-[#1E293B]">
                    <td className="px-6 py-4 font-medium text-[#E2E8F0]">
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 text-[#E2E8F0]/70">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 text-[#E2E8F0]/70">{admin.store}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          admin.status === "Active"
                            ? "bg-[#1E293B] text-[#63C2B0]"
                            : "bg-[#1E293B] text-[#63C2B0]"
                        }`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className={`text-sm font-semibold ${
                          admin.status === "Active"
                            ? "text-[#63C2B0]"
                            : "text-[#63C2B0]"
                        }`}
                      >
                        {admin.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
