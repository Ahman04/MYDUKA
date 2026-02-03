import { useState } from "react";
import {
  Bell,
  ClipboardCheck,
  CreditCard,
  Package,
  Store,
  Users,
} from "lucide-react";

export default function AdminPanel() {
  const [supplyRequests] = useState([
    {
      product: "Rice - 5kg",
      quantity: 50,
      requestedBy: "Mike Clerk",
      date: "2025-01-26",
      notes: "Stock running low",
      status: "Pending",
    },
    {
      product: "Cooking Oil - 2L",
      quantity: 30,
      requestedBy: "Mike Clerk",
      date: "2025-01-25",
      notes: "High demand",
      status: "Approved",
    },
    {
      product: "Sugar - 2kg",
      quantity: 40,
      requestedBy: "Lucy Clerk",
      date: "2025-01-27",
      notes: "Prepare for weekend rush",
      status: "Pending",
    },
  ]);

  const clerks = [
    {
      name: "Mike Clerk",
      email: "mike@myduka.com",
      joined: "2025-01-01",
      status: "Active",
    },
    {
      name: "Lucy Clerk",
      email: "lucy@myduka.com",
      joined: "2025-01-10",
      status: "Active",
    },
  ];

  const paymentStatus = [
    {
      product: "Rice - 5kg",
      supplier: "Kenya Grains Ltd",
      stock: 120,
      price: "KES 450",
      status: "Paid",
    },
    {
      product: "Cooking Oil - 2L",
      supplier: "Oil Suppliers Inc",
      stock: 85,
      price: "KES 280",
      status: "Unpaid",
    },
    {
      product: "Sugar - 2kg",
      supplier: "Sugar Mills Co",
      stock: 200,
      price: "KES 180",
      status: "Paid",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* HEADER */}
      <div className="bg-[#1E293B] border-b border-[#1E293B]">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#1E293B] text-[#E2E8F0] flex items-center justify-center font-bold">
              M
            </div>
            <div>
              <p className="text-sm text-[#E2E8F0]/70">MyDuka Admin</p>
              <h1 className="text-xl font-semibold text-[#E2E8F0]">
                Store Overview
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full border border-[#1E293B] p-2 text-[#E2E8F0]/70 hover:text-[#E2E8F0]">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <div className="text-sm text-[#E2E8F0]/70 text-right">
              Jane Admin <span className="block text-xs">Admin</span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8 text-[#E2E8F0]">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Active Clerks"
            value="2"
            trend="+1 this week"
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Pending Requests"
            value="2"
            trend="Needs review"
            icon={<ClipboardCheck className="h-5 w-5" />}
          />
          <StatCard
            title="Unpaid Products"
            value="1"
            trend="1 supplier"
            icon={<CreditCard className="h-5 w-5" />}
          />
          <StatCard
            title="Store Value"
            value="KES 149.8K"
            trend="Estimated"
            icon={<Store className="h-5 w-5" />}
          />
        </div>

        {/* SUPPLY REQUESTS */}
        <Section
          title="Supply Requests"
          subtitle="Review and approve stock refill requests."
        >
        <Table
          headers={[
            "Product",
            "Quantity",
            "Requested By",
            "Date",
            "Notes",
            "Status",
            "Actions",
          ]}
          emptyMessage="No supply requests at the moment."
          isEmpty={supplyRequests.length === 0}
        >
          {supplyRequests.map((req, idx) => (
            <tr key={idx} className="border-t border-[#1E293B]">
              <td className="py-3">{req.product}</td>
              <td className="py-3">{req.quantity}</td>
              <td className="py-3">{req.requestedBy}</td>
              <td className="py-3">{req.date}</td>
              <td className="py-3">{req.notes}</td>
              <td className="py-3">
                <StatusBadge status={req.status} />
              </td>
              <td className="py-3">
                {req.status === "Pending" ? (
                  <div className="flex items-center gap-2">
                    <button className="rounded-md bg-[#1E293B] px-3 py-1 text-[#63C2B0]">
                      Approve
                    </button>
                    <button className="rounded-md bg-[#1E293B] px-3 py-1 text-[#63C2B0]">
                      Decline
                    </button>
                  </div>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </Table>
        </Section>

        {/* PAYMENT STATUS */}
        <Section
          title="Product Payment Status"
          subtitle="Track supplier payments and update status."
        >
        <Table
          headers={[
            "Product",
            "Supplier",
            "Stock",
            "Buy Price",
            "Payment Status",
            "Actions",
          ]}
          emptyMessage="No products have been recorded yet."
          isEmpty={paymentStatus.length === 0}
        >
          {paymentStatus.map((item, idx) => (
            <tr key={idx} className="border-t border-[#1E293B]">
              <td className="py-3">{item.product}</td>
              <td className="py-3">{item.supplier}</td>
              <td className="py-3">{item.stock}</td>
              <td className="py-3">{item.price}</td>
              <td className="py-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="py-3">
                <button className="rounded-md bg-[#1E293B] px-3 py-1 text-[#E2E8F0] hover:opacity-90">
                  Update
                </button>
              </td>
            </tr>
          ))}
        </Table>
        </Section>

        {/* CLERK MANAGEMENT */}
        <Section
          title="Clerk Management"
          subtitle="Manage clerk access and assignments."
          actions={
            <button className="rounded-md bg-[#63C2B0] px-3 py-1.5 text-sm text-[#0F172A] hover:opacity-90">
              Add Clerk
            </button>
          }
        >
        <Table
          headers={["Name", "Email", "Joined Date", "Status", "Actions"]}
          emptyMessage="No clerks have been added yet."
          isEmpty={clerks.length === 0}
        >
          {clerks.map((clerk, idx) => (
            <tr key={idx} className="border-t border-[#1E293B]">
              <td className="py-3">{clerk.name}</td>
              <td className="py-3 text-[#E2E8F0]/70">{clerk.email}</td>
              <td className="py-3">{clerk.joined}</td>
              <td className="py-3">
                <StatusBadge status={clerk.status} />
              </td>
              <td className="py-3">
                <button className="rounded-md bg-[#1E293B] px-3 py-1 text-[#63C2B0]">
                  Deactivate
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

/* ---------- REUSABLE COMPONENTS ---------- */

function StatCard({ title, value, trend, icon }) {
  return (
    <div className="bg-[#1E293B] p-4 rounded-lg border border-[#1E293B] shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#E2E8F0]/70">{title}</p>
        <span className="rounded-full bg-[#1E293B] p-2 text-[#63C2B0]">
          {icon}
        </span>
      </div>
      <h2 className="mt-2 text-xl font-bold text-[#63C2B0]">{value}</h2>
      <p className="mt-1 text-xs text-[#E2E8F0]/60">{trend}</p>
    </div>
  );
}

function Section({ title, children, actions, subtitle }) {
  return (
    <div className="bg-[#1E293B] rounded-lg shadow mb-8 p-4 border border-[#1E293B]">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-semibold text-[#E2E8F0]">{title}</h3>
          {subtitle ? (
            <p className="text-sm text-[#E2E8F0]/70">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}

function Table({ headers, children, emptyMessage, isEmpty }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[#E2E8F0]/60">
            {headers.map((h) => (
              <th key={h} className="pb-2 pr-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td className="py-6 text-[#E2E8F0]/70" colSpan={headers.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    Pending: "bg-[#1E293B] text-[#63C2B0]",
    Approved: "bg-[#1E293B] text-[#63C2B0]",
    Paid: "bg-[#1E293B] text-[#63C2B0]",
    Unpaid: "bg-[#1E293B] text-[#63C2B0]",
    Active: "bg-[#1E293B] text-[#63C2B0]",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        colors[status]
      }`}
    >
      {status}
    </span>
  );
}
