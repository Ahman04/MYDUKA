import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(222,60%,28%)] text-lg font-bold text-white">
              M
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                MyDuka
              </p>
              <p className="text-lg font-semibold text-slate-800">Inventory Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link
              to="/login"
              className="rounded-full bg-[hsl(222,60%,28%)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[hsl(222,60%,24%)]"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(35,90%,55%)]">
                Modern inventory control
              </p>
              <h1 className="mt-4 text-4xl font-bold text-[hsl(222,60%,28%)] sm:text-5xl">
                Track stock, automate reports, and keep every store aligned.
              </h1>
              <p className="mt-5 text-lg text-slate-600">
                MyDuka helps merchants, admins, and clerks handle stock taking,
                procurement status, and performance reporting without spreadsheets.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="rounded-full bg-[hsl(222,60%,28%)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[hsl(222,60%,24%)]"
                >
                  Sign in to dashboard
                </Link>
                <a
                  href="#features"
                  className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  View features
                </a>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Weekly report
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-800">
                    Stock intake up 18%
                  </p>
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                    <div className="h-2 w-4/5 rounded-full bg-[hsl(35,90%,55%)]"></div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Paid suppliers
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-slate-800">124</p>
                    <p className="text-sm text-emerald-600">+6 this month</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Unpaid items
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-slate-800">32</p>
                    <p className="text-sm text-rose-600">Needs review</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Store performance
                  </p>
                  <div className="mt-3 space-y-2">
                    {[
                      { name: "Central", value: "72%" },
                      { name: "Riverside", value: "64%" },
                      { name: "Uptown", value: "58%" },
                    ].map((store) => (
                      <div key={store.name} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{store.name}</span>
                        <span className="font-semibold text-slate-800">{store.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-800">The problem</h2>
              <p className="mt-4 text-slate-600">
                Stock taking and record keeping can be tedious, and many teams still rely
                on manual processes that slow down procurement and reporting.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-800">The solution</h2>
              <p className="mt-4 text-slate-600">
                MyDuka delivers centralized inventory updates, clear payment status,
                and automated weekly, monthly, and annual reports—all in one place.
              </p>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6"
        >
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[hsl(222,60%,28%)]">
              Everything your team needs to stay aligned.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              "Token-based admin onboarding controlled by the merchant.",
              "Clerk dashboards for intake, spoilage, pricing, and stock balances.",
              "Supply request workflows for store admins.",
              "Paid vs unpaid procurement views and quick status updates.",
              "Store-by-store performance insights and product-level drill-downs.",
              "Weekly, monthly, and annual reports with charts and trends.",
            ].map((feature) => (
              <div key={feature} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-slate-600">{feature}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="grid gap-8 lg:grid-cols-3">
              {[
                {
                  title: "Merchant",
                  detail:
                    "Oversee admins, activate or deactivate accounts, and review store-by-store performance.",
                },
                {
                  title: "Admin",
                  detail:
                    "Approve supply requests, manage clerks, and track payments per supplier.",
                },
                {
                  title: "Clerk",
                  detail:
                    "Log inventory intake, stock levels, spoilage, and pricing in minutes.",
                },
              ].map((role) => (
                <div key={role.title}>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(35,90%,55%)]">
                    {role.title}
                  </p>
                  <p className="mt-3 text-slate-600">{role.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-slate-600">
                Ready to experience MyDuka?
              </p>
              <Link
                to="/login"
                className="rounded-full bg-[hsl(222,60%,28%)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[hsl(222,60%,24%)]"
              >
                Sign in to continue
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
