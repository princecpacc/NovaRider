import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../../components/logo";
import apiRequest from "../../services/api";

export default function UserSignup() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setUserData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/users/signup", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      const user = data.data?.user || data.user;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/users/dashboard");
    } catch (errorData) {
      console.error("Signup error:", errorData);

      setError(
        errorData.message ||
          errorData.errors?.[0]?.msg ||
          "Unable to create your account"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100";

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-gray-50 to-gray-100 px-4 py-6">
      <section className="mx-auto w-full max-w-md">
        <div className="-mt-6">
          <Logo />
        </div>

        <div className="-mt-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/60">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-rose-500">
              Join NovaRide
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Sign up as a passenger and start booking rides.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={6}
                required
              />

              <p className="mt-1 text-xs text-gray-400">
                Use at least 6 characters.
              </p>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Phone number
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter your phone number"
                autoComplete="tel"
                required
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-rose-500 px-4 py-3.5 text-lg font-bold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-rose-500 hover:underline"
            >
              Login here
            </Link>
          </p>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Drive with us
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 text-center">
            <h2 className="font-semibold text-gray-900">
              Want to earn by driving?
            </h2>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              Create a captain account and start accepting rides.
            </p>

            <Link
              to="/captains/signup"
              className="mt-4 block w-full rounded-xl border border-rose-500 px-4 py-3 font-semibold text-rose-500 transition hover:bg-rose-500 hover:text-white"
            >
              Sign up as a Captain
            </Link>
          </div>

          <p className="mt-7 text-center text-xs leading-5 text-gray-500">
            By proceeding, you agree to receive account and ride-related calls
            and messages from NovaRide.
          </p>
        </div>
      </section>
    </main>
  );
}