import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Share2,
  Star,
  MoreVertical,
  ChevronRight,
  X,
} from "lucide-react";

import { useState } from "react";

export default function RideConfirmedPanel({
  ride,
}) {
  const [view, setView] = useState("main");
  const [cancelReason, setCancelReason] = useState("");

  const captain = ride?.captain;
  const vehicle = captain?.vehicle;

  const captainName = captain?.name || "Captain";

  const rating = captain?.rating || 4.8;

  const totalRides =
    captain?.totalRides || 0;

  const vehicleType =
    vehicle?.vehicleType ||
    ride?.vehicleType ||
    "car";

  const vehicleName =
    vehicleType === "bike"
      ? "Nova Bike"
      : vehicleType === "auto"
      ? "Nova Auto"
      : "Nova Go";

  /*
   * IMPORTANT:
   * Backend doesn't need to provide image.
   * We select the frontend image based on vehicle type.
   */
  const vehicleImage =
    vehicle?.image ||
    (
      vehicleType === "bike"
        ? "/images/novaride-bike.png"
        : vehicleType === "auto"
        ? "/images/novaride-auto.png"
        : "/images/novaride-car.png"
    );

  const vehicleNumber = vehicle?.licensePlate;

  const vehicleColor = vehicle?.color || "";

  const eta = ride?.eta ?? 4;

  const pickup = ride?.pickup;

  const destination = ride?.destination;

  const fare = ride?.fare;

  const distanceKm = ride?.distanceKm;

  const durationMinutes = ride?.durationMinutes;


  // --------------------------------
  // CALL CAPTAIN
  // --------------------------------

  const handleCall = () => {
    if (!captain?.phone) {
      console.log(
        "Captain phone number unavailable"
      );
      return;
    }

    window.location.href =
      `tel:${captain.phone}`;
  };


  // --------------------------------
  // MESSAGE CAPTAIN
  // --------------------------------

  const handleMessage = () => {
    if (!captain?.phone) {
      console.log(
        "Captain phone number unavailable"
      );
      return;
    }

    window.location.href =
      `sms:${captain.phone}`;
  };


  // --------------------------------
  // SHARE RIDE
  // --------------------------------

  const handleShare = async () => {
    const shareText = `
NovaRide ride confirmed!

Captain: ${captainName}
Vehicle: ${vehicleName}
Vehicle Number: ${vehicleNumber}

Pickup: ${pickup}
Destination: ${destination}

Fare: ₹${fare}
    `.trim();

    try {
      if (navigator.share) {
        await navigator.share({
          title: "NovaRide Ride",
          text: shareText,
        });

        return;
      }

      await navigator.clipboard.writeText(
        shareText
      );

      alert(
        "Ride details copied!"
      );

    } catch (error) {
      console.log(
        "Share cancelled:",
        error
      );
    }
  };


  // --------------------------------
  // CANCEL RIDE
  // --------------------------------

  const handleCancelRide = () => {
    if (!cancelReason) {
      return;
    }

    /*
     * Backend cancellation API can be
     * connected here later.
     */

    console.log(
      "CANCEL RIDE:",
      cancelReason
    );
  };


  // =====================================================
  // TRIP DETAILS
  // =====================================================

  if (view === "tripDetails") {
    return (
      <div className="h-full overflow-y-auto px-4 pb-6 pt-2">

        {/* HEADER */}

        <div className="relative flex items-center justify-between">

          <button
            type="button"
            onClick={() => setView("main")}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-gray-700
              active:scale-95
            "
          >
            <ArrowLeft size={17} />
          </button>

          <h2 className="text-[14px] font-bold text-gray-950">
            Trip Details
          </h2>

          <button
            type="button"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-gray-700
            "
          >
            <MoreVertical size={18} />
          </button>

        </div>


        {/* DATE */}

        <p className="mt-3 text-center text-[10px] text-gray-400">
          {new Date().toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          )}
          {" • "}
          {new Date().toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          )}
        </p>


        {/* ROUTE */}

        <div className="mt-5">

          <div className="flex items-start gap-3">

            <div className="flex flex-col items-center">

              <div className="h-3 w-3 rounded-full bg-rose-500" />

              <div className="h-9 w-px bg-gray-200" />

              <div className="h-3 w-3 rounded-full bg-black" />

            </div>


            <div className="flex-1">

              <div>
                <p className="text-[11px] font-semibold text-gray-900">
                  {pickup}
                </p>

                <p className="mt-0.5 text-[9px] text-gray-400">
                  Pickup
                </p>
              </div>


              <div className="mt-6">

                <p className="text-[11px] font-semibold text-gray-900">
                  {destination}
                </p>

                <p className="mt-0.5 text-[9px] text-gray-400">
                  Drop
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* RIDE FARE */}

        <div className="mt-6 border-t border-gray-100 pt-4">

          <p className="text-[12px] font-bold text-gray-900">
            Ride Fare
          </p>

          <div className="mt-3 space-y-2">

            <div className="flex justify-between text-[11px]">

              <span className="text-gray-500">
                Base fare
              </span>

              <span className="font-medium text-gray-900">
                ₹{Math.round(fare * 0.75)}
              </span>

            </div>


            <div className="flex justify-between text-[11px]">

              <span className="text-gray-500">
                Distance ({distanceKm.toFixed(1)} km)
              </span>

              <span className="font-medium text-gray-900">
                ₹{Math.round(fare * 0.2)}
              </span>

            </div>


            <div className="flex justify-between text-[11px]">

              <span className="text-gray-500">
                Time ({durationMinutes} mins)
              </span>

              <span className="font-medium text-gray-900">
                ₹{Math.round(fare * 0.05)}
              </span>

            </div>

          </div>

        </div>


        {/* TOTAL */}

        <div className="mt-4 border-t border-gray-100 pt-4">

          <div className="flex justify-between">

            <p className="text-[12px] font-bold text-gray-900">
              Total Fare
            </p>

            <p className="text-[13px] font-bold text-gray-900">
              ₹{fare}
            </p>

          </div>

        </div>


        {/* PAYMENT */}

        <div className="mt-4 border-t border-gray-100 pt-4">

          <p className="text-[12px] font-bold text-gray-900">
            Payment
          </p>

          <div className="mt-2 flex items-center gap-2">

            <div className="flex h-5 w-5 items-center justify-center rounded bg-green-100">
              <span className="text-[10px] text-green-600">
                ₹
              </span>
            </div>

            <span className="text-[11px] font-medium text-gray-700">
              Cash
            </span>

          </div>

        </div>


        {/* SUPPORT */}

        <div className="mt-5 rounded-xl border border-gray-100 p-3 text-center">

          <p className="text-[10px] text-gray-400">
            Need help with this trip?
          </p>

          <button
            type="button"
            className="
              mt-2
              rounded-lg
              bg-gray-50
              px-5
              py-2
              text-[11px]
              font-semibold
              text-gray-700
            "
          >
            Get Support
          </button>

        </div>

      </div>
    );
  }


  // =====================================================
  // CANCEL RIDE
  // =====================================================

  if (view === "cancelRide") {

    const reasons = [
      "Changed my plans",
      "Captain is taking too long",
      "Found another ride",
      "Captain asked me to cancel",
      "Wrong pickup location",
      "Other",
    ];

    return (
      <div className="h-full overflow-y-auto px-4 pb-6 pt-2">

        {/* HEADER */}

        <div className="relative flex items-center justify-between">

          <button
            type="button"
            onClick={() => setView("main")}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-gray-100
            "
          >
            <ArrowLeft size={17} />
          </button>

          <h2 className="text-[14px] font-bold text-gray-950">
            Cancel Ride
          </h2>

          <button
            type="button"
            onClick={() => setView("main")}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-gray-100
            "
          >
            <X size={17} />
          </button>

        </div>


        {/* TITLE */}

        <div className="mt-6">

          <h3 className="text-[17px] font-bold text-gray-950">
            Why are you cancelling?
          </h3>

          <p className="mt-1 text-[11px] text-gray-500">
            Please tell us why you want to cancel this ride.
          </p>

        </div>


        {/* REASONS */}

        <div className="mt-5 space-y-2">

          {reasons.map((reason) => {

            const selected =
              cancelReason === reason;

            return (
              <button
                key={reason}
                type="button"
                onClick={() =>
                  setCancelReason(reason)
                }
                className={`
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  border
                  px-4
                  py-3
                  text-left
                  transition

                  ${
                    selected
                      ? "border-rose-400 bg-rose-50"
                      : "border-gray-100 bg-white"
                  }
                `}
              >

                <span
                  className={`
                    text-[12px]
                    font-medium

                    ${
                      selected
                        ? "text-gray-950"
                        : "text-gray-700"
                    }
                  `}
                >
                  {reason}
                </span>


                <div
                  className={`
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    border

                    ${
                      selected
                        ? "border-rose-500"
                        : "border-gray-300"
                    }
                  `}
                >

                  {selected && (
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  )}

                </div>

              </button>
            );
          })}

        </div>


        {/* BUTTONS */}

        <div className="mt-6 flex gap-3">

          <button
            type="button"
            onClick={() => setView("main")}
            className="
              flex-1
              rounded-xl
              border
              border-gray-200
              py-3
              text-[12px]
              font-semibold
              text-gray-700
            "
          >
            Keep Ride
          </button>


          <button
            type="button"
            disabled={!cancelReason}
            onClick={handleCancelRide}
            className="
              flex-1
              rounded-xl
              bg-rose-500
              py-3
              text-[12px]
              font-bold
              text-white
              disabled:cursor-not-allowed
              disabled:bg-gray-300
            "
          >
            Cancel Ride
          </button>

        </div>

      </div>
    );
  }


  // =====================================================
  // MAIN CONFIRMED RIDE
  // =====================================================

  return (
    <div className="h-full overflow-y-auto px-4 pb-5 pt-2">

      {/* ================= HEADER ================= */}

      <div className="relative flex items-center justify-center">

        <h2 className="text-[15px] font-bold text-gray-950">
          Your ride is confirmed! 🎉
        </h2>


        {/* THREE DOT MENU */}

        <button
          type="button"
          onClick={() => setView("menu")}
          className="
            absolute
            right-0
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            text-gray-700
            transition
            hover:bg-gray-100
            active:scale-95
          "
        >
          <MoreVertical size={19} />
        </button>

      </div>


      {/* ================= MENU ================= */}

      {view === "menu" && (
        <div
          className="
            absolute
            right-5
            top-12
            z-50
            w-[190px]
            overflow-hidden
            rounded-xl
            border
            border-gray-100
            bg-white
            shadow-xl
          "
        >

          <button
            type="button"
            onClick={() => setView("tripDetails")}
            className="
              flex
              w-full
              items-center
              justify-between
              px-4
              py-3
              text-left
              text-[12px]
              font-medium
              text-gray-800
              hover:bg-gray-50
            "
          >
            Trip Details
            <ChevronRight size={15} className="text-gray-400" />
          </button>


          <button
            type="button"
            onClick={() => {
              setView("main");
              handleShare();
            }}
            className="
              flex
              w-full
              items-center
              justify-between
              border-t
              border-gray-100
              px-4
              py-3
              text-left
              text-[12px]
              font-medium
              text-gray-800
              hover:bg-gray-50
            "
          >
            Share your ride
            <Share2 size={15} className="text-gray-400" />
          </button>


          <button
            type="button"
            onClick={() => setView("cancelRide")}
            className="
              flex
              w-full
              items-center
              justify-between
              border-t
              border-gray-100
              px-4
              py-3
              text-left
              text-[12px]
              font-medium
              text-red-500
              hover:bg-red-50
            "
          >
            Cancel ride
            <ChevronRight size={15} />
          </button>

        </div>
      )}


      {/* ================= CAPTAIN ================= */}

      <div className="mt-6 flex items-center">

        {/* Avatar */}

        <div
          className="
            flex
            h-[58px]
            w-[58px]
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-full
            bg-gray-100
          "
        >

          {/* {captain?.profileImage ? (
            <img
              src={captain.profileImage}
              alt={captainName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-[24px]">
              👨🏻
            </div>
          )} */}

          <img
              src="https://imgs.search.brave.com/fFVGZpNNUtmbLeBYq0_Ux287XeVR0BpEPShHdALzFoA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2UxLzE0/LzFkL2UxMTQxZGI1/MTljMDUzY2I2MjRm/N2I0YjE0ZTFiNDVi/LmpwZw"
              alt={captainName}
              className="h-full w-full object-cover"
            />

        </div>


        {/* Captain Details */}

        <div className="ml-8 min-w-0 flex-1">

          <p className="truncate text-[13px] font-bold text-gray-950">
            {captainName}
          </p>

          <div className="mt-1 flex items-center gap-1">

            <Star
              size={11}
              fill="currentColor"
              strokeWidth={2}
              className="text-rose-500"
            />

            <span className="text-[10px] font-semibold text-gray-700">
              {rating}
            </span>

            {totalRides > 0 && (
              <span className="text-[10px] text-gray-400">
                ({totalRides} rides)
              </span>
            )}

          </div>

        </div>


        {/* Call */}

        <button
          type="button"
          onClick={handleCall}
          disabled={!captain?.phone}
          className="
            mr-2
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-rose-50
            text-rose-500
            disabled:opacity-40
          "
        >
          <Phone size={16} />
        </button>


        {/* Message */}

        <button
          type="button"
          onClick={handleMessage}
          disabled={!captain?.phone}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-rose-50
            text-rose-500
            disabled:opacity-40
          "
        >
          <MessageCircle size={16} />
        </button>

      </div>


      {/* ================= VEHICLE ================= */}

      <div className="mt-5 flex items-center">

        <div
          className="
            flex
            h-[58px]
            w-[58px]
            shrink-0
            items-center
            justify-center
          "
        >

          <img
            src={vehicleImage}
            alt={vehicleName}
            className="h-full w-full object-contain"
            onError={(e) => {
              console.error(
                "Vehicle image failed:",
                vehicleImage
              );
              e.currentTarget.style.display = "none";
            }}
          />

        </div>


        <div className="ml-5">

          <p className="text-[12px] font-bold text-gray-950">
            {vehicleColor
              ? `${vehicleColor} `
              : ""}
            {vehicleName}
          </p>

          <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-gray-700">
            {vehicleNumber}
          </p>

        </div>

      </div>


      {/* ================= ETA ================= */}

      <div className="mt-6 text-center">

        <p className="text-[14px] font-bold text-gray-950">
          Arriving in {eta} mins
        </p>

      </div>


      {/* ================= ETA PROGRESS ================= */}

      <div className="mt-3 h-[5px] w-full overflow-hidden rounded-full bg-gray-200">

        <div
          className="
            h-full
            w-[32%]
            rounded-full
            bg-rose-500
          "
        />

      </div>


    


     

    </div>
  );
}