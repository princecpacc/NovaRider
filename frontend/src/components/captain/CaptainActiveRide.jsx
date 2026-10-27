import { MapPin, Navigation, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const CaptainActiveRide = ({
  ride,
  onArrived,
  onVerifyOtp,
  onComplete,
  loading,
}) => {
  const [otp, setOtp] = useState("");

  if (!ride) return null;

  const handleOtpChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 4);

    setOtp(value);
  };

  return (
    <div className="absolute h-94 bottom-0 left-0 right-0 z-30 rounded-t-[28px] bg-white p-5 shadow-2xl">

      {/* ================= ACCEPTED ================= */}

      {ride.status === "accepted" && (
        <>
          <div className="flex  items-center gap-3">

            

            <div>
              <p className="text-[17px] font-bold text-gray-950">
                Ride Accepted
              </p>

              <p className="text-[12px] text-gray-500">
                Head to pickup location
              </p>
            </div>

          </div>

          <RouteDetails ride={ride} />

          <button
            type="button"
            className="mt-5 w-full rounded-2xl bg-rose-500 py-3.5 text-sm font-bold text-white"
          >
            Navigate to pickup
          </button>

          <button
            type="button"
            onClick={onArrived}
            disabled={loading}
            className="mt-3 w-full rounded-2xl border border-gray-200 py-3.5 text-sm font-bold text-gray-800 shadow-md  disabled:opacity-50"
          >
            {loading ? "Updating..." : "I've arrived"}
          </button>
        </>
      )}

      {/* ================= ARRIVED ================= */}

      {ride.status === "arrived" && (
        <>
          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
              <CheckCircle2
                size={25}
                className="text-rose-500"
              />
            </div>

            <h2 className="mt-3 text-[18px] font-bold text-gray-950">
              Passenger has arrived
            </h2>

            <p className="mt-1 text-[12px] text-gray-500">
              Ask the passenger for their pickup OTP
            </p>

          </div>

          <div className="mt-6">

            <p className="mb-2 text-[12px] font-semibold text-gray-700">
              Enter 4-digit OTP
            </p>

            <input
              value={otp}
              onChange={handleOtpChange}
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              className="
                w-full
                rounded-2xl
                border
                border-gray-200
                px-4
                py-4
                text-center
                text-2xl
                font-bold
                tracking-[12px]
                outline-none
                focus:border-rose-500
              "
            />

          </div>

          <button
            type="button"
            disabled={otp.length !== 4 || loading}
            onClick={() => onVerifyOtp(otp)}
            className="
              mt-4
              w-full
              rounded-2xl
              bg-rose-500
              py-3.5
              text-sm
              font-bold
              text-white
              disabled:bg-gray-300
            "
          >
            {loading
              ? "Verifying..."
              : "Verify OTP & Start Ride"}
          </button>
        </>
      )}

      {/* ================= ONGOING ================= */}

      {ride.status === "ongoing" && (
        <>
          <div className="text-center">

            <p className="text-[18px] font-bold text-gray-950">
              Ride in progress
            </p>

            <p className="mt-1 text-[12px] text-gray-500">
              Drive safely to the destination
            </p>

          </div>

          <RouteDetails ride={ride} />

          <button
            type="button"
            onClick={onComplete}
            disabled={loading}
            className="
              mt-5
              w-full
              rounded-2xl
              bg-rose-500
              py-3.5
              text-sm
              font-bold
              text-white
              disabled:opacity-50
            "
          >
            {loading
              ? "Completing..."
              : "Complete Ride"}
          </button>
        </>
      )}

      {/* ================= COMPLETED ================= */}

{ride.status === "completed" && (
  <>
    <div className="text-center">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
        <CheckCircle2
          size={25}
          className="text-green-500"
        />
      </div>

      <h2 className="mt-3 text-[18px] font-bold text-gray-950">
        Ride Completed
      </h2>

      <p className="mt-1 text-[12px] text-gray-500">
        You have successfully completed this ride.
      </p>

    </div>

    <RouteDetails ride={ride} />

    <div className="mt-5 rounded-2xl bg-gray-50 p-4 text-center">

      <p className="text-[11px] text-gray-400">
        TOTAL FARE
      </p>

      <p className="mt-1 text-2xl font-black text-gray-950">
        ₹{ride?.fare}
      </p>

    </div>

    <button
      type="button"
      onClick={() => window.location.reload()}
      className="
        mt-5
        w-full
        rounded-2xl
        bg-rose-500
        py-3.5
        text-sm
        font-bold
        text-white
      "
    >
      Done
    </button>
  </>
)}

    </div>
  );
};

const RouteDetails = ({ ride }) => {
  return (
    <div className="mt-5 space-y-4">

      <div className="flex items-start gap-4">

        <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-rose-500" />

        <div className="min-w-0">
          <p className="text-[11px] text-gray-400">
            Pickup
          </p>

          <p className="truncate text-[14px] font-semibold text-gray-900">
            {ride.pickup}
          </p>
        </div>

      </div>

      <div className="flex items-start gap-4">

        <MapPin
          size={16}
          className="mt-1 shrink-0 text-rose-500"
        />

        <div className="min-w-0">
          <p className="text-[11px] text-gray-400">
            Destination
          </p>

          <p className="truncate text-[14px] font-semibold text-gray-900">
            {ride.destination}
          </p>
        </div>

      </div>

    </div>
  );
};

export default CaptainActiveRide;