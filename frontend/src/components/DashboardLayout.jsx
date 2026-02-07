/**
 * Dashboard layout with dark Navy sidebar, light content area.
 * Design tokens: Navy primary, Amber secondary.
 */
import { Link, useNavigate } from "react-router-dom";
import {
  HiChartPie,
  HiInbox,
  HiLogout,
  HiShoppingBag,
  HiUser,
  HiUsers,
  HiViewGrid,
} from "react-icons/hi";
import { getStoredUser, getDashboardRoute, logoutSession, normalizeRole } from "../services/api";

export default function DashboardLayout({ role: rawRole, children }) {
  const role = normalizeRole(rawRole);
  const navigate = useNavigate();
  const user = getStoredUser();
  const basePath = getDashboardRoute(role);

  const handleLogout = async () => {
    await logoutSession();
    navigate("/", { replace: true });
  };

  const clerkItems = [
    { href: `${basePath}`, icon: HiChartPie, label: "Dashboard" },
    { href: `${basePath}#record`, icon: HiShoppingBag, label: "Record Inventory" },
    { href: `${basePath}#supply`, icon: HiInbox, label: "Supply Requests" },
  ];

  const adminItems = [
    { href: `${basePath}`, icon: HiChartPie, label: "Dashboard" },
    { href: `${basePath}#clerks`, icon: HiUsers, label: "Clerks" },
    { href: `${basePath}#supply`, icon: HiInbox, label: "Supply Requests" },
    { href: `${basePath}#payments`, icon: HiShoppingBag, label: "Payments" },
  ];

  const merchantItems = [
    { href: `${basePath}`, icon: HiChartPie, label: "Dashboard" },
    { href: `${basePath}#stores`, icon: HiViewGrid, label: "Stores" },
    { href: `${basePath}#admins`, icon: HiUsers, label: "Admins" },
  ];

  const items =
    role === "clerk"
      ? clerkItems
      : role === "admin"
        ? adminItems
        : merchantItems;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <aside
        className="fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-[hsl(222,60%,28%)] text-white"
        aria-label="MyDuka sidebar"
      >
        <div className="mb-5 flex items-center pl-5 pt-5">
          <Link to={basePath} className="self-center whitespace-nowrap text-xl font-semibold text-[hsl(35,90%,55%)] hover:text-[hsl(35,90%,65%)] transition-colors">
            MyDuka
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="mb-1 text-sm font-medium text-white">
            {user?.first_name} {user?.last_name}
          </div>
          <div className="text-xs text-slate-400 capitalize">{role}</div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <HiLogout className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>
      <main className="ml-64 flex-1 min-h-screen bg-slate-50 p-6 text-slate-800">{children}</main>
    </div>
  );
}
