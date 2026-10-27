const RideRequestCard = ({
  ride,
  timeLeft,
  onAccept,
  onReject,
  loading,
}) => {
  if (!ride) return null;

  return (
    <div className="absolute bottom-24 left-4 right-4 z-30 rounded-3xl bg-white p-5 shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            New ride request
          </p>

          <h2 className="mt-1 text-lg font-bold text-gray-900">
            Ride request
          </h2>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50">
          <span className="text-sm font-bold text-rose-500">
            {timeLeft}s
          </span>
        </div>

      </div>

      {/* Route */}
      <div className="mt-5 space-y-4">

        <div className="flex gap-3">
          <div className="mt-1 h-3 w-3 rounded-full bg-rose-500" />

          <div>
            <p className="text-[10px] text-gray-400">
              PICKUP
            </p>

            <p className="text-sm font-semibold text-gray-900">
              {ride.pickup}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="mt-1 h-3 w-3 rounded-full bg-black" />

          <div>
            <p className="text-[10px] text-gray-400">
              DESTINATION
            </p>

            <p className="text-sm font-semibold text-gray-900">
              {ride.destination}
            </p>
          </div>
        </div>

      </div>

      {/* Ride information */}
      <div className="mt-5 grid grid-cols-2 gap-3">

        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[10px] text-gray-400">
            VEHICLE
          </p>

          <p className="mt-1 text-sm font-bold capitalize">
            {ride.vehicleType}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-3">
          <p className="text-[10px] text-gray-400">
            FARE
          </p>

          <p className="mt-1 text-sm font-bold">
            ₹{ride.fare}
          </p>
        </div>

      </div>

      {/* Actions */}
      <div className="mt-5 grid grid-cols-2 gap-3">

        <button
          type="button"
          onClick={onReject}
          disabled={loading}
          className="rounded-2xl border border-gray-200 py-3 text-sm font-bold text-gray-700"
        >
          Reject
        </button>

        <button
          type="button"
          onClick={() => onAccept(ride._id)}
          disabled={loading}
          className="rounded-2xl bg-rose-500 py-3 text-sm font-bold text-white"
        >
          {loading ? "Accepting..." : "Accept"}
        </button>

      </div>

    </div>
  );
};

export default RideRequestCard;