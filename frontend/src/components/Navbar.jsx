import { Link, useNavigate } from "react-router-dom";

import Logo from "./logo";
import apiRequest from "../services/api";

export default function Navbar({ accountType = "user" }) {
  const navigate = useNavigate();

  const isCaptain = accountType === "captain";

  const profilePath = isCaptain
    ? "/captains/profile"
    : "/users/profile";

  const tokenKey = isCaptain
    ? "captainToken"
    : "token";

  const dataKey = isCaptain
    ? "captain"
    : "user";

  const logoutEndpoint = isCaptain
    ? "/captains/logout"
    : "/users/logout";

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem(tokenKey);

      if (token) {
        await apiRequest(logoutEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(dataKey);

      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        
          <Logo className="w-28 sm:w-32" />
        

        <nav className="flex items-center gap-3 sm:gap-5">
          <Link
            to="/"
            className="hidden text-sm font-medium text-gray-600 transition hover:text-rose-500 sm:block"
          >
            Home
          </Link>

          <Link
            to={profilePath}
            className="text-sm font-medium text-gray-600 transition hover:text-rose-500"
          >
            Profile
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 active:scale-[0.98]"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}