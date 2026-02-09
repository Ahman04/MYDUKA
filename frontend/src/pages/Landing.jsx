/**
 * Marketing landing page.
 * Highlights MyDuka value props and routes users to the login screen.
 */
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Package,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  const highlights = [
    {
      title: "Live stock visibility",
      description: "Track receipts, on-hand inventory, and spoilage in one place.",
      icon: Package,
    },
    {
      title: "Decision-ready reports",
      description: "Weekly, monthly, and annual performance insights with visuals.",
      icon: BarChart3,
    },
    {
      title: "Secure role access",
      description: "Merchant, Admin, and Clerk workflows with JWT protection.",
      icon: ShieldCheck,
    },
  ];

  const productHighlights = [
    {
      title: "Inventory accuracy",
      description: "Record every stock movement with payment status and pricing.",
      stat: "Real-time",
    },
    {
      title: "Procurement clarity",
      description: "Separate paid vs unpaid products to protect cash flow.",
      stat: "Paid / Unpaid",
    },
    {
      title: "Operational control",
      description: "Approve supply requests and manage clerk activity fast.",
      stat: "Role-based",
    },
  ];

  const features = [
    "Inventory CRUD with spoilage and pricing capture",
    "Supply request workflow with approvals",
    "Paid vs unpaid supplier tracking",
    "Role dashboards with performance summaries",
    "Notifications for low stock and pending approvals",
    "Reports with bar and line charts",
  ];

  const roleBenefits = [
    {
      title: "Merchant",
      description: "Oversee every store and drive strategy.",
      items: [
        "Invite and manage store admins",
        "Store-by-store performance views",
        "Product-level profitability insights",
      ],
    },
    {
      title: "Admin",
      description: "Run the store daily operations.",
      items: [
        "Approve or decline supply requests",
        "Manage clerk accounts and activity",
        "Update payment status per supplier",
      ],
    },
    {
      title: "Clerk",
      description: "Capture inventory activity accurately.",
      items: [
        "Record received, stock, and spoilage",
        "Log buying and selling prices",
        "Request additional supply when low",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white font-semibold">
              M
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">MyDuka</p>
              <p className="text-xs text-[var(--color-muted)]">Inventory Management</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-[var(--color-muted)] md:flex">
            <a className="hover:text-[var(--color-text)]" href="#highlights">Highlights</a>
            <a className="hover:text-[var(--color-text)]" href="#features">Features</a>
            <a className="hover:text-[var(--color-text)]" href="#roles">Roles</a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              className="hidden rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text)] shadow-sm hover:border-[var(--color-primary)] md:inline-flex"
              href="#features"
            >
              Explore
            </a>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/20"
            >
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--color-primary)] shadow-sm">
              <Sparkles className="h-4 w-4" />
              Inventory + Reporting System
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-[var(--color-text)] sm:text-5xl">
              Replace manual stock tracking with a clear, role-based operating system.
            </h1>
            <p className="mt-5 text-base leading-7 text-[var(--color-muted)]">
              MyDuka helps merchants, admins, and clerks track stock, manage procurement
              payments, and surface operational insights in minutes instead of hours.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/20"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-[var(--color-text)]"
              >
                View features
              </a>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-[var(--color-muted)]">Coverage</p>
                <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">Weekly to annual reporting</p>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-[var(--color-muted)]">Security</p>
                <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">JWT + role-based access</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-lg shadow-black/5"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-primary)]">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-[var(--color-text)]">{item.title}</p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)] p-5 text-white shadow-lg">
              <p className="text-sm font-semibold">From manual to modern</p>
              <p className="mt-2 text-sm text-white/80">
                Cut reconciliation time and give every role the clarity they need.
              </p>
            </div>
          </div>
        </section>

        <section id="highlights" className="py-12">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--color-text)]">Product highlights</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                The most important operational outcomes your team expects.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {productHighlights.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-lg shadow-black/5"
              >
                <p className="text-xs font-semibold text-[var(--color-primary)]">{card.stat}</p>
                <p className="mt-3 text-lg font-semibold text-[var(--color-text)]">{card.title}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="py-12">
          <div className="rounded-3xl border border-[var(--color-border)] bg-white px-8 py-10 shadow-lg shadow-black/5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-[var(--color-text)]">Core features</h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Built to match MyDuka&apos;s inventory, procurement, and reporting requirements.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-bg)] px-4 py-2 text-xs font-semibold text-[var(--color-text)]">
                <Users className="h-4 w-4" />
                Role-ready workflows
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--color-primary)]" />
                  <p className="text-sm text-[var(--color-text)]">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="roles" className="py-12">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold text-[var(--color-text)]">Role-based benefits</h2>
            <p className="text-sm text-[var(--color-muted)]">
              Each role gets a focused dashboard and actions aligned to responsibilities.
            </p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {roleBenefits.map((role) => (
              <div
                key={role.title}
                className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-lg shadow-black/5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                  {role.title}
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--color-text)]">{role.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
                  {role.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="sign-in" className="py-12">
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-8 shadow-xl shadow-black/5 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-sm font-semibold text-[var(--color-primary)]">Ready to sign in?</p>
                <h2 className="mt-3 text-3xl font-semibold text-[var(--color-text)]">
                  Keep your stock accurate and your team aligned.
                </h2>
                <p className="mt-4 text-sm text-[var(--color-muted)]">
                  Use your demo credentials on the sign-in page or complete an admin invite to get started.
                </p>
                <div className="mt-6 space-y-2 text-sm text-[var(--color-muted)]">
                  <p><span className="font-semibold text-[var(--color-text)]">Merchant:</span> merchant@myduka.com / merchant123</p>
                  <p><span className="font-semibold text-[var(--color-text)]">Admin:</span> admin@myduka.com / admin123</p>
                  <p><span className="font-semibold text-[var(--color-text)]">Clerk:</span> clerk@myduka.com / clerk123</p>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-inner">
                <p className="text-sm font-semibold text-[var(--color-text)]">Sign in to continue</p>
                <p className="mt-2 text-xs text-[var(--color-muted)]">
                  You&apos;ll be redirected to the classic MyDuka login screen.
                </p>
                <Link
                  to="/login"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/30"
                >
                  Go to login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
