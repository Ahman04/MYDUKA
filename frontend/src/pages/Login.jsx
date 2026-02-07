/**
 * Authentication page.
 * Handles standard sign-in and admin invite completion using invite tokens.
 * Flowbite-styled.
 */
import { useMemo, useState } from "react";
import { Card, Label, TextInput, Button, Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi, getDashboardRoute, saveAuthSession } from "../services/api";

const DEMO_CREDENTIALS = {
  Merchant: { email: "merchant@myduka.com", password: "merchant123" },
  Admin: { email: "admin@myduka.com", password: "admin123" },
  Clerk: { email: "clerk@myduka.com", password: "clerk123" },
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite_token");
  const isInviteFlow = Boolean(inviteToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeRole, setActiveRole] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const roleLabel = useMemo(() => (isInviteFlow ? "Complete Admin Invite" : "Sign In"), [isInviteFlow]);

  const handleRoleClick = (role) => {
    const creds = DEMO_CREDENTIALS[role];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      setActiveRole(role);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = isInviteFlow
        ? await authApi.registerAdminFromInvite({
            invite_token: inviteToken,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            password,
          })
        : await authApi.login(email.trim(), password);
      const { access_token: accessToken, refresh_token: refreshToken, user } = response.data;
      saveAuthSession(accessToken, user, refreshToken);
      navigate(getDashboardRoute(user?.role), { replace: true });
    } catch (requestError) {
      const detail = requestError?.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : "Login failed. Check your credentials and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 font-sans">
      <div className="w-full max-w-4xl">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="hidden md:block">
            <h1 className="text-4xl font-bold text-[hsl(222,60%,28%)]">
              Welcome to <span className="text-[hsl(35,90%,55%)]">MyDuka</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              A web-based inventory management system designed to help merchants
              and store admins efficiently track stock, manage procurement
              payments, and generate insightful reports.
            </p>
            <div className="mt-8 space-y-4">
              <div
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm animate-float will-change-transform"
                style={{ animationDelay: "0ms" }}
              >
                <div className="h-3 w-3 rounded-full bg-[hsl(35,90%,55%)]"></div>
                <span className="text-slate-700">Real-time inventory tracking</span>
              </div>
              <div
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm animate-float will-change-transform"
                style={{ animationDelay: "300ms" }}
              >
                <div className="h-3 w-3 rounded-full bg-[hsl(35,90%,55%)]"></div>
                <span className="text-slate-700">Automated payment processing</span>
              </div>
              <div
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm animate-float will-change-transform"
                style={{ animationDelay: "600ms" }}
              >
                <div className="h-3 w-3 rounded-full bg-[hsl(35,90%,55%)]"></div>
                <span className="text-slate-700">Advanced analytics & reports</span>
              </div>
            </div>
          </div>

          <Card className="w-full max-w-md mx-auto border-slate-200 shadow-lg overflow-hidden">
            <div className="flex justify-center pt-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(222,60%,28%)] font-bold text-lg text-white">
                M
              </div>
            </div>
            <h2 className="text-center text-xl font-bold text-slate-800 mt-3">{roleLabel}</h2>
            <p className="text-center text-sm text-slate-600 mt-1">
              {isInviteFlow
                ? "Set your admin profile to activate the invite."
                : "Click a role to auto-fill demo credentials"}
            </p>

            {!isInviteFlow && (
              <div className="mt-4 flex justify-center gap-2">
                {["Merchant", "Admin", "Clerk"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleClick(role)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                      activeRole === role
                        ? "bg-[hsl(222,60%,28%)] text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 px-5 sm:px-6">
              {isInviteFlow ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName" value="First Name" className="text-slate-700" />
                    <TextInput
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1.5 w-full h-11 text-base px-3 rounded-lg border-slate-200 focus:border-[hsl(222,60%,28%)] focus:ring-[hsl(222,60%,28%)]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" value="Last Name" className="text-slate-700" />
                    <TextInput
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1.5 w-full h-11 text-base px-3 rounded-lg border-slate-200 focus:border-[hsl(222,60%,28%)] focus:ring-[hsl(222,60%,28%)]"
                    />
                  </div>
                </div>
              ) : null}
              {isInviteFlow ? (
                <Alert color="info" icon={HiInformationCircle} className="text-sm">
                  Admin invite token detected. Your email will be taken from the invite link.
                </Alert>
              ) : (
                <div>
                  <Label htmlFor="email" value="Email" className="text-slate-700" />
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setActiveRole(null); }}
                    className="mt-1.5 w-full h-11 text-base px-3 rounded-lg border-slate-200 focus:border-[hsl(222,60%,28%)] focus:ring-[hsl(222,60%,28%)]"
                  />
                </div>
              )}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <Label htmlFor="password" value="Password" className="text-slate-700" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-xs font-medium text-[hsl(222,60%,28%)] hover:underline"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <TextInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setActiveRole(null); }}
                  className="mt-1.5 w-full h-11 text-base px-3 rounded-lg border-slate-200 focus:border-[hsl(222,60%,28%)] focus:ring-[hsl(222,60%,28%)]"
                />
              </div>
              {error ? (
                <Alert color="failure" className="text-sm">
                  {error}
                </Alert>
              ) : null}
              <Button
                type="submit"
                className="w-full !bg-[hsl(222,60%,28%)] hover:!bg-[hsl(222,60%,24%)] !border-transparent focus:!ring-[hsl(222,60%,28%)] font-semibold py-2.5"
                isProcessing={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Working..." : isInviteFlow ? "Create Admin Account" : "Log In"}
              </Button>
            </form>

            <div className="mt-4 pb-5 text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <span className="text-[hsl(222,60%,28%)] hover:underline cursor-pointer font-medium">Sign Up</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
