export default function StatusBadge({ status }) {
  const colors = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Paid: "bg-emerald-100 text-emerald-700",
    Unpaid: "bg-rose-100 text-rose-700",
    Active: "bg-emerald-100 text-emerald-700",
    "In Stock": "bg-emerald-100 text-emerald-700",
    "Low Stock": "bg-amber-100 text-amber-700",
    "Out of Stock": "bg-rose-100 text-rose-700",
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