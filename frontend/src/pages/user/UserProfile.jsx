import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../../components/logo";
import apiRequest from "../../services/api";
import Navbar from "../../components/Navbar";

function UserProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError("");

        const token = localStorage.getItem("token");

        // User is not logged in
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const data = await apiRequest("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(data.user);
      } catch (errorData) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          errorData.message ||
            "Your session has expired. Please log in again."
        );
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      const token = localStorage.getItem("token");

      if (token) {
        await apiRequest("/users/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (errorData) {
      console.error("Logout error:", errorData);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login", { replace: true });
    }
  };

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <section className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-lg">
          <h1 className="text-xl font-bold text-gray-900">
            Unable to load profile
          </h1>

          <p className="mt-2 text-sm text-red-500">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="mt-5 w-full rounded-xl bg-rose-500 px-4 py-3 font-semibold text-white transition hover:bg-rose-600"
          >
            Go to Login
          </button>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-rose-500" />

          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  const firstLetter = user.name?.charAt(0).toUpperCase() || "U";

  return (
  <>
    <Navbar accountType="user" />

    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <section className="mx-auto w-full max-w-5xl">
        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          {/* Profile card */}
          <aside className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-rose-100 text-4xl font-bold text-rose-500">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <h1 className="mt-4 text-2xl font-bold text-gray-900">
                {user.name}
              </h1>

              <span className="mt-2 inline-block rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-500">
                Passenger
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Email
                </p>
                <p className="mt-1 break-all font-medium text-gray-800">
                  {user.email}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Phone
                </p>
                <p className="mt-1 font-medium text-gray-800">
                  {user.phone || "Not provided"}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Member since
                </p>
                <p className="mt-1 font-medium text-gray-800">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Not available"}
                </p>
              </div>
            </div>
          </aside>

          {/* Main dashboard */}
          <div className="space-y-6">
            <section className="rounded-3xl bg-gradient-to-r from-rose-500 to-rose-400 p-6 text-white shadow-sm">
              <p className="text-sm font-medium text-rose-100">
                Welcome back
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                Ready for your next ride?
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-rose-100">
                Book a ride, view your recent journeys, and manage your
                NovaRide account.
              </p>

              <button
                type="button"
                className="mt-5 rounded-xl bg-white px-5 py-3 font-semibold text-rose-500 transition hover:bg-rose-50"
              >
                Book a Ride
              </button>
            </section>

            {/* Stats */}
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Total rides</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
              </div>
            </section>

            {/* Quick actions */}
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Quick actions
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="rounded-xl border border-gray-200 px-4 py-4 text-left transition hover:border-rose-300 hover:bg-rose-50"
                >
                  <p className="font-semibold text-gray-900">Ride history</p>
                  <p className="mt-1 text-sm text-gray-500">
                    View your previous rides
                  </p>
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-gray-200 px-4 py-4 text-left transition hover:border-rose-300 hover:bg-rose-50"
                >
                  <p className="font-semibold text-gray-900">Account settings</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your account details
                  </p>
                </button>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  </>
);
}

export default UserProfile;