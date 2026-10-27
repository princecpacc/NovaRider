import {
  Home,
  WalletCards,
  MapPinned,
  UserRound,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const CaptainBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      path: "/captains/dashboard",
    },
    {
      id: "earnings",
      label: "Earnings",
      icon: WalletCards,
      path: "/captains/earnings",
    },
    {
      id: "trips",
      label: "Trips",
      icon: MapPinned,
      path: "/captains/history",
    },
    {
      id: "profile",
      label: "Profile",
      icon: UserRound,
      path: "/captains/profile",
    },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white px-2 pb-2 pt-2">

      <div className="grid grid-cols-4">

        {items.map((item) => {
          const Icon = item.icon;

          const active =
            location.pathname === item.path;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 py-1.5 "
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.4 : 1.7}
                className={
                  active
                    ? "text-rose-500"
                    : "text-gray-800"
                }
              />

              <span
                className={`text-[10px] font-semibold  ${
                  active
                    ? "text-rose-500"
                    : "text-gray-800"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

      </div>
    </nav>
  );
};

export default CaptainBottomNav;