import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../components/logo";
import apiRequest from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("user");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setError("");
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    setLoading(true);
    setError("");

    console.log("1️⃣ Login started");
    console.log("Login type:", loginType);
    console.log("Form data:", formData);

    const endpoint =
      loginType === "captain"
        ? "/captains/login"
        : "/users/login";

    console.log("2️⃣ Endpoint:", endpoint);

    const data = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(formData),
    });

    console.log("3️⃣ Login response:", data);

    if (loginType === "captain") {
      const captainData = data.captain;

      console.log("4️⃣ Captain data:", captainData);
      console.log("5️⃣ Captain token:", data.token);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      localStorage.setItem("captainToken", data.token);
      localStorage.setItem(
        "captain",
        JSON.stringify(captainData)
      );

      console.log("6️⃣ Captain saved to localStorage");
      console.log(
        "7️⃣ Navigating to /captains/profile"
      );

      navigate("/captains/dashboard");
    } else {
      const userData = data.user;

      localStorage.removeItem("captainToken");
      localStorage.removeItem("captain");

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      console.log("Navigating to /users/dashboard");

      navigate("/users/dashboard");
    }
  } catch (errorData) {
    console.error("❌ Login error:", errorData);

    setError(
      errorData.message ||
        errorData.error ||
        errorData.errors?.[0]?.msg ||
        "Unable to login. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   try {
  //     setLoading(true);
  //     setError("");

  //     const endpoint =
  //       loginType === "captain"
  //         ? "/captains/login"
  //         : "/users/login";

  //     const data = await apiRequest(endpoint, {
  //       method: "POST",
  //       body: JSON.stringify(formData),
  //     });

  //     console.log("Login response:", data);

  //     if (loginType === "captain") {
  //       const captainData = data.captain;

  //       localStorage.removeItem("token");
  //       localStorage.removeItem("user");

  //       localStorage.setItem("captainToken", data.token);
  //       localStorage.setItem(
  //         "captain",
  //         JSON.stringify(captainData)
  //       );

  //       navigate("/captains/profile");
  //     } else {
  //       const userData = data.user;

  //       localStorage.removeItem("captainToken");
  //       localStorage.removeItem("captain");

  //       localStorage.setItem("token", data.token);
  //       localStorage.setItem(
  //         "user",
  //         JSON.stringify(userData)
  //       );

  //       navigate("/users/dashboard");
  //     }
  //   } catch (errorData) {
  //     console.error("Login error:", errorData);

  //     setError(
  //       errorData.message ||
  //         errorData.error ||
  //         errorData.errors?.[0]?.msg ||
  //         "Unable to login. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const signupPath =
    loginType === "captain"
      ? "/captains/signup"
      : "/users/signup";

  return (
    <main className="flex min-h-screen justify-center bg-gradient-to-b from-rose-50 to-gray-100 px-4 py-6">
      <section className="w-full max-w-md">
        <div className="-mt-5">
          <Logo />
        </div>

        <div className="-mt-5 rounded-xl border border-gray-200 bg-white p-5 shadow-xl shadow-gray-200/60 sm:p-7">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-rose-500">
              Welcome back
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Login to NovaRide
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Select your account type and enter your login details.
            </p>
          </div>

          {/* Passenger/Captain selector */}
          <div className="mb-6 grid grid-cols-2 rounded bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => handleLoginTypeChange("user")}
              className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                loginType === "user"
                  ? "bg-white text-rose-500 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Passenger
            </button>

            <button
              type="button"
              onClick={() =>
                handleLoginTypeChange("captain")
              }
              className={`rounded px-4 py-3 text-sm font-semibold transition ${
                loginType === "captain"
                  ? "bg-white text-rose-500 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Captain
            </button>
          </div>

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >
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
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full rounded border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
                required
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                {/* <button
                  type="button"
                  className="text-xs font-semibold text-rose-500 hover:underline"
                >
                  Forgot password?
                </button> */}
              </div>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
                required
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-rose-500 px-4 py-3.5 text-lg font-bold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Logging in..."
                : loginType === "captain"
                  ? "Login as Captain"
                  : "Login as Passenger"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600">
            New to NovaRide?{" "}
            <Link
              to={signupPath}
              className="font-semibold text-rose-500 hover:underline"
            >
              {loginType === "captain"
                ? "Become a Captain"
                : "Create an account"}
            </Link>
          </p>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium uppercase text-gray-400">
              NovaRide
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="text-center text-xs leading-5 text-gray-500">
            By proceeding, you agree to receive account and ride-related
            calls and messages from NovaRide.
          </p>
        </div>
      </section>
    </main>
  );
}