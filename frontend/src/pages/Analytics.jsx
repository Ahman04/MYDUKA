/**
 * Analytics page.
 * Surfaces financial and operational reports with CSV exports.
 */
import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import { analyticsApi, api } from "../services/api";

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [storePerformance, setStorePerformance] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [slowMovers, setSlowMovers] = useState([]);
  const [paymentTrend, setPaymentTrend] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [
        summaryRes,
        storeRes,
        topRes,
        slowRes,
        paymentRes,
        salesRes,
        expenseRes,
      ] = await Promise.all([
        analyticsApi.financialSummary(),
        analyticsApi.storePerformance({ limit: 10 }),
        analyticsApi.topProducts({ limit: 10 }),
        analyticsApi.slowMovers({ limit: 10 }),
        analyticsApi.paymentTrend({ days: 14 }),
        analyticsApi.salesTrend({ days: 14 }),
        analyticsApi.expensesByCategory(),
      ]);
      setSummary(summaryRes.data);
      setStorePerformance(storeRes.data);
      setTopProducts(topRes.data);
      setSlowMovers(slowRes.data);
      setPaymentTrend(paymentRes.data);
      setSalesTrend(salesRes.data);
      setExpenseCategories(expenseRes.data);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to load analytics.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const downloadCsv = async (path, filename) => {
    const response = await api.get(path, { responseType: "blob" });
    const url = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <PageShell title="Reporting & Analytics" subtitle="Business performance and trends.">
      {error ? (
        <div className="mb-4 rounded-xl border border-[#DC2626]/30 bg-[#DC2626]/10 px-4 py-3 text-sm text-[#DC2626]">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard label="Total Sales" value={summary?.total_sales} />
        <SummaryCard label="Gross Profit" value={summary?.gross_profit} />
        <SummaryCard label="Total Expenses" value={summary?.total_expenses} />
        <SummaryCard label="Net Profit" value={summary?.net_profit} />
      </div>

      <section className="mt-8 rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-[#064E3B]">Store Performance</h2>
          <button
            onClick={() => downloadCsv("/api/analytics/store-performance/export", "store-performance.csv")}
            className="rounded-lg border border-[#D1FAE5] px-3 py-1.5 text-xs text-[#6B7280]"
          >
            Export CSV
          </button>
        </div>
        <DataTable
          headers={["Store", "Sales", "Profit", "Orders"]}
          rows={storePerformance.map((item) => [
            item.store_name,
            formatCurrency(item.total_sales),
            formatCurrency(item.total_profit),
            item.orders,
          ])}
        />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#064E3B]">Top Products</h2>
            <button
              onClick={() => downloadCsv("/api/analytics/top-products/export", "top-products.csv")}
              className="rounded-lg border border-[#D1FAE5] px-3 py-1.5 text-xs text-[#6B7280]"
            >
              Export CSV
            </button>
          </div>
          <DataTable
            headers={["Product", "Qty", "Sales", "Profit"]}
            rows={topProducts.map((item) => [
              item.product_name,
              item.quantity_sold,
              formatCurrency(item.total_sales),
              formatCurrency(item.total_profit),
            ])}
          />
        </div>
        <div className="rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-[#064E3B]">Slow Movers</h2>
          <DataTable
            headers={["Product", "Qty", "Sales"]}
            rows={slowMovers.map((item) => [
              item.product_name,
              item.quantity_sold,
              formatCurrency(item.total_sales),
            ])}
          />
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-[#064E3B]">Payment Status Trend</h2>
          <DataTable
            headers={["Date", "Paid", "Unpaid"]}
            rows={paymentTrend.map((item) => [
              item.date,
              formatCurrency(item.paid_total),
              formatCurrency(item.unpaid_total),
            ])}
          />
        </div>
        <div className="rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-[#064E3B]">Sales Trend</h2>
          <DataTable
            headers={["Date", "Sales", "Profit"]}
            rows={salesTrend.map((item) => [
              item.date,
              formatCurrency(item.total_sales),
              formatCurrency(item.total_profit),
            ])}
          />
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-[#D1FAE5] bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[#064E3B]">Expenses by Category</h2>
        <DataTable
          headers={["Category", "Amount"]}
          rows={expenseCategories.map((item) => [item.category, formatCurrency(item.total_amount)])}
        />
      </section>
    </PageShell>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-[#D1FAE5] bg-white p-4 shadow-sm">
      <p className="text-sm text-[#6B7280]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#064E3B]">
        {value === undefined ? "—" : formatCurrency(value)}
      </p>
    </div>
  );
}

function DataTable({ headers, rows }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-[#6B7280]">
            {headers.map((header) => (
              <th key={header} className="pb-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="py-6 text-sm text-[#6B7280]">
                No data available.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index} className="border-t border-[#D1FAE5]">
                {row.map((cell, cellIndex) => (
                  <td key={`${index}-${cellIndex}`} className="py-3">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function formatCurrency(value) {
  const amount = Number(value || 0);
  return `KES ${amount.toFixed(2)}`;
}
