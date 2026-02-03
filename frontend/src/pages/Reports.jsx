import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import Section from "../components/Section.jsx";

export default function Reports() {
  const [dateRange, setDateRange] = useState("monthly");
  const [selectedStore, setSelectedStore] = useState("all");

  const monthlyData = [
    { month: "Jan", revenue: 12000, expenses: 8000, profit: 4000 },
    { month: "Feb", revenue: 15000, expenses: 9000, profit: 6000 },
    { month: "Mar", revenue: 18000, expenses: 11000, profit: 7000 },
    { month: "Apr", revenue: 22000, expenses: 13000, profit: 9000 },
    { month: "May", revenue: 25000, expenses: 15000, profit: 10000 },
    { month: "Jun", revenue: 28000, expenses: 17000, profit: 11000 }
  ];

  const productPerformance = [
    { name: "Rice", value: 35, color: "#3b82f6" },
    { name: "Oil", value: 25, color: "#10b981" },
    { name: "Sugar", value: 20, color: "#f59e0b" },
    { name: "Others", value: 20, color: "#ef4444" }
  ];

  const storeComparison = [
    { store: "Store A", sales: 45000, profit: 12000 },
    { store: "Store B", sales: 38000, profit: 9500 },
    { store: "Store C", sales: 52000, profit: 15000 }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Reports & Analytics</h1>
              <p className="text-slate-600">Visualized business insights and performance metrics</p>
            </div>
            <div className="flex gap-4">
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <select 
                value={selectedStore} 
                onChange={(e) => setSelectedStore(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="all">All Stores</option>
                <option value="store-a">Store A</option>
                <option value="store-b">Store B</option>
                <option value="store-c">Store C</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <Section title="Revenue vs Profit Trends" subtitle="Monthly financial performance overview">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`KES ${value.toLocaleString()}`, ""]} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} name="Revenue" />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="Profit" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </Section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Section title="Product Performance Distribution" subtitle="Sales breakdown by product category">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productPerformance}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {productPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Store Comparison" subtitle="Sales and profit by store location">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={storeComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="store" />
                <YAxis />
                <Tooltip formatter={(value) => [`KES ${value.toLocaleString()}`, ""]} />
                <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                <Bar dataKey="profit" fill="#10b981" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </Section>
        </div>
      </main>
    </div>
  );
}