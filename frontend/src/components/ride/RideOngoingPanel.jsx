import {
  Navigation,
  Phone,
  MessageCircle,
} from "lucide-react";

export default function RideOngoingPanel({
  ride,
}) {
  const captain = ride?.captain;

  return (
    <div className="h-full overflow-y-auto px-5 pb-6 pt-3">

      <div className="text-center">

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
          <Navigation
            size={23}
            className="text-rose-500"
          />
        </div>

        <h2 className="mt-3 text-[19px] font-bold text-gray-950">
          On your way
        </h2>

        <p className="mt-1 text-[11px] text-gray-500">
          You're heading to your destination
        </p>

      </div>

      {/* DESTINATION */}

      <div className="mt-6 rounded-2xl bg-gray-50 p-4">

        <p className="text-[10px] font-semibold text-gray-400">
          DESTINATION
        </p>

        <p className="mt-1 text-[14px] font-bold text-gray-900">
          {ride?.destination}
        </p>

      </div>

      {/* CAPTAIN */}

      <div className="mt-5 flex items-center">

        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-100">
          👨🏻
        </div>

        <div className="ml-4 flex-1">

          <p className="text-[13px] font-bold text-gray-950">
            {captain?.name || "Captain"}
          </p>

          <p className="mt-1 text-[11px] text-gray-500">
            {ride?.vehicleType === "bike"
              ? "Nova Bike"
              : ride?.vehicleType === "auto"
              ? "Nova Auto"
              : "Nova Go"}
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            window.location.href =
              `tel:${captain?.phone}`
          }
          className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500"
        >
          <Phone size={16} />
        </button>

      </div>

      {/* FARE */}

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

        <span className="text-[11px] text-gray-500">
          Fare
        </span>

        <span className="text-[14px] font-bold text-gray-950">
          ₹{ride?.fare}
        </span>

      </div>

    </div>
  );
}