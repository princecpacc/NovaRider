import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../../components/logo";
import apiRequest from "../../services/api";
import Navbar from "../../components/Navbar";


function CaptainProfile() {
  const navigate = useNavigate();

  const [captain, setCaptain] = useState(null);
  const [error, setError] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError("");

        const token = localStorage.getItem("captainToken");

        // captain is not logged in
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const data = await apiRequest("/captains/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCaptain(data.captain);
      } catch (errorData) {
        localStorage.removeItem("captainToken");
        localStorage.removeItem("captain");

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

      const token = localStorage.getItem("captainToken");

      if (token) {
        await apiRequest("/captains/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (errorData) {
      console.error("Logout error:", errorData);
    } finally {
      localStorage.removeItem("captainToken");
      localStorage.removeItem("captain");

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

  if (!captain) {
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

  const firstLetter = captain.name?.charAt(0).toUpperCase() || "U";

  return (
    <>
    <Navbar accountType="captain"></Navbar>
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-gray-100 px-4 py-6">
      <section className="mx-auto w-full max-w-md">
        

        <div className="-mt-4 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-200/60">
          {/* Profile header */}
          <div className="bg-gradient-to-r from-rose-500 to-rose-400 px-6 py-8 text-center text-white">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/70 bg-white text-3xl font-bold text-rose-500 shadow-lg">
              {firstLetter}
            </div>

            <h1 className="mt-4 text-2xl font-bold">{captain.name}</h1>

            <p className="mt-1 text-sm text-rose-100">
              NovaRide Passenger
            </p>
          </div>

          {/* captain information */}
          <div className="space-y-4 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Full name
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {captain.name || "Not provided"}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Email address
              </p>

              <p className="mt-1 break-all font-medium text-gray-900">
                {captain.email || "Not provided"}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Phone number
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {captain.phone || "Not provided"}
              </p>
            </div>

            {captain.role && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Account type
                </p>

                <span className="mt-2 inline-block rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold capitalize text-rose-500">
                  {captain.role}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutLoading}
              className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {logoutLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          Your account information is protected by NovaRide.
        </p>
      </section>
    </main>
    </>
  );
}

export default CaptainProfile;