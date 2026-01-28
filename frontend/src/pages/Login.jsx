import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login clicked", { email, password });
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT SECTION */}
      <div className="hidden md:flex w-1/2 flex-col justify-center px-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to MyDuka</h1>

        <p className="text-gray-600 mb-8 max-w-md">
          Manage your store inventory, track payments, and generate insightful
          reports all in one place.
        </p>

        {/* IMAGE PLACEHOLDER */}
        <div className="w-full max-w-md">
          <img
            src="/images/login-illustration.png"
            alt="Login illustration"
            className="w-full"
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-blue-50">
        <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md">
          {/* LOGO */}
          <div className="flex justify-center mb-4">
            <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-1">Sign In</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Please enter your login details
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="admin@myduka.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* REMEMBER & FORGOT */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>

              <span className="text-indigo-600 cursor-pointer">
                Forgot password?
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Log In
            </button>
          </form>

          {/* ROLES */}
          <div className="mt-6 text-center space-x-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              Merchant
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              Admin
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              Clerk
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
