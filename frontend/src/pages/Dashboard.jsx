import { useState } from "react";
import {
  AlertTriangle,
  Box,
  LogOut,
  PackagePlus,
  Send,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const [activeForm, setActiveForm] = useState("record");
  const getInventoryStatus = (stock) => {
    if (stock <= 0) return "Out of Stock";
    if (stock <= 50) return "Low Stock";
    return "In Stock";
  };

  const inventoryStatusStyles = {
    "In Stock": { backgroundColor: "#1E293B", color: "#63C2B0" },
    "Low Stock": { backgroundColor: "#1E293B", color: "#63C2B0" },
    "Out of Stock": { backgroundColor: "#1E293B", color: "#63C2B0" },
  };
  const stats = [
    {
      label: "Total Products",
      value: "3",
      icon: <Box className="h-5 w-5" />,
      color: "text-[#63C2B0]",
      valueColor: "text-[#63C2B0]",
    },
    {
      label: "Total Stock",
      value: "405",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-[#63C2B0]",
      valueColor: "text-[#63C2B0]",
    },
    {
      label: "Spoilt Items",
      value: "5",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-[#63C2B0]",
      valueColor: "text-[#63C2B0]",
    },
  ];

  const products = [
    {
      product: "Rice - 5kg",
      category: "Grains",
      stock: 120,
      spoil: 3,
      buyPrice: "KES 450",
      sellPrice: "KES 600",
      payment: "Paid",
    },
    {
      product: "Cooking Oil - 2L",
      category: "Oils",
      stock: 85,
      spoil: 2,
      buyPrice: "KES 280",
      sellPrice: "KES 350",
      payment: "Unpaid",
    },
    {
      product: "Sugar - 2kg",
      category: "Sweeteners",
      stock: 200,
      spoil: 0,
      buyPrice: "KES 180",
      sellPrice: "KES 240",
      payment: "Paid",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <header className="border-b border-[#1E293B] bg-[#1E293B]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#1E293B] text-[#E2E8F0] flex items-center justify-center font-bold">
              M
            </div>
            <div>
              <h1 className="text-base font-semibold text-[#E2E8F0]">MyDuka</h1>
              <p className="text-xs text-[#E2E8F0]/70">
                Data Entry Clerk · Downtown Store
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-[#E2E8F0]/70">
            <div className="text-right">
              Mike Clerk <span className="block text-xs">Clerk</span>
            </div>
            <button className="rounded-full border border-[#1E293B] p-2 text-[#E2E8F0]/70 hover:text-[#E2E8F0]">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#1E293B] bg-[#1E293B] p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#E2E8F0]/70">{stat.label}</p>
                <span className={`rounded-lg bg-[#1E293B] p-2 ${stat.color}`}>
                  {stat.icon}
                </span>
              </div>
              <p className={`mt-2 text-2xl font-semibold ${stat.valueColor}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <button
            onClick={() => setActiveForm("record")}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#63C2B0] px-4 py-3 text-sm font-semibold text-[#0F172A] shadow hover:opacity-90"
          >
            <PackagePlus className="h-4 w-4" />
            Record New Product
          </button>
          <button
            onClick={() => setActiveForm("request")}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#63C2B0] px-4 py-3 text-sm font-semibold text-[#0F172A] shadow hover:opacity-90"
          >
            <Send className="h-4 w-4" />
            Request Supply
          </button>
        </div>

        {activeForm === "record" ? (
          <div className="mt-6 rounded-xl border border-[#1E293B] bg-[#1E293B] p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#E2E8F0]">
              Record New Product
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#E2E8F0]/70">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Rice - 5kg"
                  className="mt-2 w-full rounded-md border border-[#1E293B] bg-[#1E293B] px-3 py-2 text-sm text-[#E2E8F0] placeholder-[#E2E8F0]/50 focus:border-[#63C2B0] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#E2E8F0]/70">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g., Grains"
                  className="mt-2 w-full rounded-md border border-[#1E293B] bg-[#1E293B] px-3 py-2 text-sm text-[#E2E8F0] placeholder-[#E2E8F0]/50 focus:border-[#63C2B0] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#E2E8F0]/70">
                  Buying Price (KES)
                </label>
                <input
                  type="number"
                  placeholder="450"
                  className="mt-2 w-full rounded-md border border-[#1E293B] bg-[#1E293B] px-3 py-2 text-sm text-[#E2E8F0] placeholder-[#E2E8F0]/50 focus:border-[#63C2B0] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#E2E8F0]/70">
                  Selling Price (KES)
                </label>
                <input
                  type="number"
                  placeholder="600"
                  className="mt-2 w-full rounded-md border border-[#1E293B] bg-[#1E293B] px-3 py-2 text-sm text-[#E2E8F0] placeholder-[#E2E8F0]/50 focus:border-[#63C2B0] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#E2E8F0]/70">
                  Current Stock
                </label>
                <input
                  type="number"
                  placeholder="120"
                  className="mt-2 w-full rounded-md border border-[#1E293B] bg-[#1E293B] px-3 py-2 text-sm text-[#E2E8F0] placeholder-[#E2E8F0]/50 focus:border-[#63C2B0] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#E2E8F0]/70">
                  Spoilt Items
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="mt-2 w-full rounded-md border border-[#1E293B] bg-[#1E293B] px-3 py-2 text-sm text-[#E2E8F0] placeholder-[#E2E8F0]/50 focus:border-[#63C2B0] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#E2E8F0]/70">
                  Supplier
                </label>
                <input
                  type="text"
                  placeholder="Kenya Grains Ltd"
                  className="mt-2 w-full rounded-md border border-[#1E293B] bg-[#1E293B] px-3 py-2 text-sm text-[#E2E8F0] placeholder-[#E2E8F0]/50 focus:border-[#63C2B0] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#E2E8F0]/70">
                  Payment Status
                </label>
                <select className="mt-2 w-full rounded-md border border-[#1E293B] bg-[#1E293B] px-3 py-2 text-sm text-[#E2E8F0] focus:border-[#63C2B0] focus:outline-none">
                  <option>Paid</option>
                  <option>Unpaid</option>
                </select>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              <button className="rounded-lg bg-[#63C2B0] py-2 text-sm font-semibold text-[#0F172A] hover:opacity-90">
                Record Product
              </button>
              <button
                onClick={() => setActiveForm("request")}
                className="rounded-lg bg-[#1E293B] py-2 text-sm font-semibold text-[#E2E8F0] hover:opacity-90"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-[#1E293B] bg-[#1E293B] p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#E2E8F0]">
              Request Supply
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-[#E2E8F0]/70">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Rice - 5kg"
                  className="mt-2 w-full rounded-md border border-[#1E293B] bg-[#1E293B] px-3 py-2 text-sm text-[#E2E8F0] placeholder-[#E2E8F0]/50 focus:border-[#63C2B0] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#E2E8F0]/70">
                  Quantity Needed
                </label>
                <input
                  type="number"
                  placeholder="50"
                  className="mt-2 w-full rounded-md border border-[#1E293B] bg-[#1E293B] px-3 py-2 text-sm text-[#E2E8F0] placeholder-[#E2E8F0]/50 focus:border-[#63C2B0] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#E2E8F0]/70">
                  Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Reason for request..."
                  className="mt-2 w-full rounded-md border border-[#1E293B] bg-[#1E293B] px-3 py-2 text-sm text-[#E2E8F0] placeholder-[#E2E8F0]/50 focus:border-[#63C2B0] focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              <button className="rounded-lg bg-[#63C2B0] py-2 text-sm font-semibold text-[#0F172A] hover:opacity-90">
                Send Request
              </button>
              <button
                onClick={() => setActiveForm("record")}
                className="rounded-lg bg-[#1E293B] py-2 text-sm font-semibold text-[#E2E8F0] hover:opacity-90"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-xl border border-[#1E293B] bg-[#1E293B] shadow-sm">
          <div className="border-b border-[#1E293B] px-6 py-4">
            <h2 className="text-base font-semibold text-[#E2E8F0]">
              My Recorded Products
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-[#E2E8F0]/60">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Spoilt</th>
                  <th className="px-6 py-3">Buy Price</th>
                  <th className="px-6 py-3">Sell Price</th>
                  <th className="px-6 py-3">Payment</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.product} className="border-t border-[#1E293B]">
                    <td className="px-6 py-4 font-medium text-[#E2E8F0]">
                      {item.product}
                    </td>
                    <td className="px-6 py-4 text-[#E2E8F0]/70">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-[#E2E8F0]">{item.stock}</td>
                    <td className="px-6 py-4">
                      <span
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={inventoryStatusStyles[getInventoryStatus(item.stock)]}
                      >
                        {getInventoryStatus(item.stock)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#E2E8F0]">{item.spoil}</td>
                    <td className="px-6 py-4 text-[#E2E8F0]">{item.buyPrice}</td>
                    <td className="px-6 py-4 text-[#E2E8F0]">{item.sellPrice}</td>
                    <td className="px-6 py-4 text-[#E2E8F0]">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.payment === "Paid"
                            ? "bg-[#1E293B] text-[#63C2B0]"
                            : "bg-[#1E293B] text-[#63C2B0]"
                        }`}
                      >
                        {item.payment}
                      </span>
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
