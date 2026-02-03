import { Package, DollarSign, ShoppingCart, TrendingUp, Bell } from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import Section from "../components/Section.jsx";
import Table from "../components/Table.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function MerchantDashboard() {
  const products = [
    { product: "Rice - 5kg", stock: 120, price: "KES 450", sellPrice: "KES 500", status: "In Stock" },
    { product: "Cooking Oil - 2L", stock: 85, price: "KES 280", sellPrice: "KES 320", status: "In Stock" },
    { product: "Sugar - 2kg", stock: 200, price: "KES 180", sellPrice: "KES 200", status: "In Stock" }
  ];

  const totalValue = products.reduce((sum, p) => sum + (p.stock * parseInt(p.sellPrice.replace('KES ', ''))), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              M
            </div>
            <div>
              <p className="text-sm text-slate-500">MyDuka Merchant</p>
              <h1 className="text-xl font-semibold text-slate-900">
                Store Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full border border-slate-200 p-2 text-slate-500 hover:text-slate-700">
              <Bell className="h-5 w-5" />
            </button>
            <div className="text-sm text-slate-600 text-right">
              John Merchant <span className="block text-xs">Merchant</span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Products"
            value={products.length.toString()}
            trend="Active inventory"
            icon={<Package className="h-5 w-5" />}
          />
          <StatCard
            title="Total Stock Value"
            value={`KES ${(totalValue / 1000).toFixed(1)}K`}
            trend="Selling price"
            icon={<DollarSign className="h-5 w-5" />}
          />
          <StatCard
            title="Low Stock Items"
            value="0"
            trend="All stocked"
            icon={<ShoppingCart className="h-5 w-5" />}
          />
          <StatCard
            title="Revenue Today"
            value="KES 2.4K"
            trend="+12% from yesterday"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        <Section
          title="Product Inventory"
          subtitle="Manage your product stock and pricing."
          actions={
            <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white">
              Add Product
            </button>
          }
        >
          <Table
            headers={["Product", "Stock", "Buy Price", "Sell Price", "Status", "Actions"]}
            emptyMessage="No products in inventory."
            isEmpty={products.length === 0}
          >
            {products.map((product, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-3">{product.product}</td>
                <td className="py-3">{product.stock}</td>
                <td className="py-3">{product.price}</td>
                <td className="py-3">{product.sellPrice}</td>
                <td className="py-3">
                  <StatusBadge status={product.status} />
                </td>
                <td className="py-3">
                  <button className="rounded-md bg-indigo-50 px-3 py-1 text-indigo-700">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        </Section>
      </main>
    </div>
  );
}