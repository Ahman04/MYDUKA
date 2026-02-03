export default function StatCard({ title, value, trend, icon }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <span className="rounded-full bg-indigo-50 p-2 text-indigo-600">
          {icon}
        </span>
      </div>
      <h2 className="mt-2 text-xl font-bold text-slate-900">{value}</h2>
      <p className="mt-1 text-xs text-slate-400">{trend}</p>
    </div>
  );
}