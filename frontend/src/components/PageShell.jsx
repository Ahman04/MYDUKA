import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { getStoredUser, logoutSession } from "../services/api";

const defaultLinks = [
  { to: "/merchant", label: "Merchant" },
  { to: "/admin", label: "Admin" },
  { to: "/suppliers", label: "Suppliers" },
  { to: "/purchase-orders", label: "Purchase Orders" },
  { to: "/transfers", label: "Transfers" },
  { to: "/returns", label: "Returns" },
  { to: "/sales", label: "Sales" },
  { to: "/expenses", label: "Expenses" },
  { to: "/analytics", label: "Reporting" },
];

export default function PageShell({ title, subtitle, children, links = defaultLinks }) {
  const user = getStoredUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutSession();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      <header className="border-b border-[#D1FAE5] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-[#34D399]">MyDuka</p>
            <h1 className="text-xl font-semibold text-[#064E3B]">{title}</h1>
            {subtitle ? <p className="text-xs text-[#6B7280]">{subtitle}</p> : null}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="text-right">
              <p className="font-medium text-[#064E3B]">
                {user ? `${user.first_name} ${user.last_name}` : "User"}
              </p>
              <p className="text-xs text-[#6B7280]">{user?.role || "Role"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-[#D1FAE5] p-2 text-[#6B7280] hover:bg-[#D1FAE5] hover:text-[#064E3B]"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 pb-4 text-sm">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-full border px-3 py-1.5 ${
                  isActive
                    ? "border-[#34D399] bg-[#D1FAE5] text-[#064E3B]"
                    : "border-[#D1FAE5] text-[#6B7280] hover:bg-[#D1FAE5]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 text-[#064E3B]">{children}</main>
    </div>
  );
}
