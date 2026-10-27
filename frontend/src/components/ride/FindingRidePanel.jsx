import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Clock3,
  Share2,
  XCircle,
  CalendarDays,
  Hourglass,
  AlertTriangle,
  Car,
  CircleEllipsis,
  Check,
} from "lucide-react";

const CANCEL_REASONS = [
  {
    id: "plans",
    label: "Changing my plans",
    icon: CalendarDays,
  },
  {
    id: "taking-too-long",
    label: "Taking too long to find a driver",
    icon: Hourglass,
  },
  {
    id: "mistake",
    label: "Booked by mistake",
    icon: AlertTriangle,
  },
  {
    id: "another-ride",
    label: "Found another ride",
    icon: Car,
  },
  {
    id: "other",
    label: "Other",
    icon: CircleEllipsis,
  },
];

export default function FindingRidePanel({
  vehicle,
  fare,
  onBack,
  onCancel,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);

  const menuRef = useRef(null);

  /*
   * Close three-dot menu when clicking outside.
   */
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [showMenu]);

  if (!vehicle) {
    return null;
  }

  const handleOpenCancel = () => {
    setShowMenu(false);
    setShowCancelSheet(true);
  };

  const handleCloseCancel = () => {
    setShowCancelSheet(false);
    setSelectedReason(null);
  };

  const handleConfirmCancel = () => {
    if (!selectedReason) {
      return;
    }

    console.log(
      "CANCEL REASON:",
      selectedReason
    );

    onCancel?.(selectedReason);

    setShowCancelSheet(false);
  };

  return (
    <div className="relative h-full overflow-hidden bg-white">

      {/* =====================================================
          MAIN FINDING SCREEN
      ===================================================== */}

      <div
        className={`
          h-full
          overflow-y-auto
          px-5
          pb-8
          pt-3
          transition-all
          duration-300
          ${
            showCancelSheet
              ? "scale-[0.98] opacity-70"
              : "scale-100 opacity-100"
          }
        `}
      >

        {/* ================= HEADER ================= */}

        <div className="relative flex items-center">

          {/* BACK */}

          <button
            type="button"
            onClick={onBack}
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-gray-900
              transition
              duration-200
              hover:bg-gray-200
              active:scale-90
            "
          >
            <ArrowLeft size={21} strokeWidth={2.2} />
          </button>


          {/* TITLE */}

          <div className="ml-3 min-w-0 flex-1">

            <h1 className="
              text-xl
              font-bold
              leading-tight
              text-gray-950
            ">
              Finding your ride
            </h1>

            <p className="
              mt-1
              truncate
              text-sm
              text-gray-500
            ">
              Looking for a nearby{" "}
              {vehicle.name?.toLowerCase()}
            </p>

          </div>


          {/* THREE DOT */}

          <div
            ref={menuRef}
            className="relative"
          >

            <button
              type="button"
              onClick={() =>
                setShowMenu((prev) => !prev)
              }
              className={`
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                transition
                duration-200
                active:scale-90
                ${
                  showMenu
                    ? "bg-gray-200"
                    : "bg-gray-100 hover:bg-gray-200"
                }
              `}
            >
              <MoreVertical
                size={21}
                strokeWidth={2.3}
              />
            </button>


            {/* ================= MENU ================= */}

            {showMenu && (
              <div
                className="
                  absolute
                  right-0
                  top-14
                  z-[100]
                  w-60
                  origin-top-right
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                  p-2
                  shadow-[0_15px_45px_rgba(0,0,0,0.15)]
                  animate-[menuIn_180ms_ease-out]
                "
              >

                {/* WHY WAITING */}

                <button
                  type="button"
                  onClick={() =>
                    setShowMenu(false)
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-left
                    transition
                    hover:bg-gray-50
                  "
                >
                  <span className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-gray-100
                  ">
                    <Clock3 size={18} />
                  </span>

                  <span className="
                    text-sm
                    font-medium
                    text-gray-900
                  ">
                    Why am I waiting?
                  </span>
                </button>


                {/* SHARE */}

                <button
                  type="button"
                  onClick={() =>
                    setShowMenu(false)
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-left
                    transition
                    hover:bg-gray-50
                  "
                >
                  <span className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-gray-100
                  ">
                    <Share2 size={18} />
                  </span>

                  <span className="
                    text-sm
                    font-medium
                    text-gray-900
                  ">
                    Share ride details
                  </span>
                </button>


                {/* CANCEL */}

                <button
                  type="button"
                  onClick={handleOpenCancel}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-left
                    transition
                    hover:bg-red-50
                  "
                >
                  <span className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-red-50
                    text-red-500
                  ">
                    <XCircle size={18} />
                  </span>

                  <span className="
                    text-sm
                    font-medium
                    text-red-500
                  ">
                    Cancel ride
                  </span>
                </button>

              </div>
            )}

          </div>

        </div>


        {/* =================================================
            VEHICLE RADAR
        ================================================= */}

        <div className="
          relative
          mx-auto
          mt-8
          flex
          h-64
          w-64
          items-center
          justify-center
        ">

          {/* RADAR RINGS */}

          <div className="
            absolute
            h-44
            w-44
            rounded-full
            border
            border-rose-200
            bg-rose-200/30
            animate-[radarPulse_2.8s_ease-out_infinite]
          " />

          <div className="
            absolute
            h-36
            w-36
            rounded-full
            border
            border-rose-200
            bg-rose-100/40
            [animation:radarPulse_2.8s_ease-out_700ms_infinite]
          " />

          <div className="
            absolute
            h-28
            w-28
            rounded-full
            border
            border-rose-300
            bg-rose-400/10
            [animation:radarPulse_2.8s_ease-out_1400ms_infinite]
          " />

          {/* INNER GLOW */}

          <div className="
            absolute
            h-24
            w-24
            rounded-full
            bg-rose-400/10
            blur-md
          " />

          {/* VEHICLE */}

          <div className="
            relative
            z-10
            flex
            h-30
            w-30
            items-center
            justify-center
          ">

            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="
                h-30
                w-30
                object-contain
                drop-shadow-[0_12px_12px_rgba(0,0,0,0.20)]
                animate-[vehicleFloat_2.5s_ease-in-out_infinite]
              "
            />

          </div>

        </div>


        {/* =================================================
            STATUS
        ================================================= */}

        <div className="mt-2 text-center">

          <h2 className="
            text-xl
            font-bold
            text-gray-950
          ">
            Finding your ride...
          </h2>

          <p className="
            mt-1
            text-sm
            text-gray-500
          ">
            We're matching you with a nearby driver
          </p>

        </div>


        {/* =================================================
            STATUS DOTS
        ================================================= */}

        <div className="
          mx-auto
          mt-6
          flex
          max-w-xs
          items-center
        ">

          <StatusStep
            label="Searching"
            active
          />

          <StatusLine />

          <StatusStep label="Matched" />

          <StatusLine />

          <StatusStep label="Arriving" />

          <StatusLine />

          <StatusStep label="On trip" />

        </div>


        {/* =================================================
            SELECTED RIDE CARD
        ================================================= */}

        <div className="
          mt-8
          rounded-2xl
          border
          border-gray-100
          bg-white
          p-4
          shadow-[0_5px_25px_rgba(0,0,0,0.07)]
        ">

          <div className="flex items-center">

            <div className="
              flex
              h-16
              w-20
              shrink-0
              items-center
              justify-center
            ">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="
                  h-16
                  w-20
                  object-contain
                "
              />
            </div>


            <div className="ml-3 min-w-0 flex-1">

              <p className="
                text-base
                font-bold
                text-gray-950
              ">
                {vehicle.name}
              </p>

              <p className="
                mt-1
                text-sm
                text-gray-500
              ">
                Your selected ride
              </p>

            </div>


            <p className="
              text-xl
              font-bold
              text-gray-950
            ">
              ₹{fare}
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          CANCEL REASON BOTTOM SHEET
      ===================================================== */}

      {showCancelSheet && (
        <div className="
          absolute
          inset-0
          z-[200]
          flex
          items-end
          bg-black/20
          backdrop-blur-[2px]
          animate-[overlayIn_200ms_ease-out]
        ">

          <div className="
            w-full
            rounded-t-[30px]
            bg-white
            px-5
            pb-7
            pt-3
            shadow-[0_-15px_50px_rgba(0,0,0,0.18)]
            animate-[sheetUp_300ms_cubic-bezier(.22,1,.36,1)]
          ">

            {/* HANDLE */}

            <div className="
              mx-auto
              mb-5
              h-1.5
              w-12
              rounded-full
              bg-gray-300
            " />


            {/* HEADER */}

            <div className="flex items-center justify-between">

              <h2 className="
                text-xl
                font-bold
                text-gray-950
              ">
                Why are you canceling?
              </h2>

              <button
                type="button"
                onClick={handleCloseCancel}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                  text-gray-600
                  transition
                  hover:bg-gray-200
                "
              >
                <X size={18} />
              </button>

            </div>


            {/* REASONS */}

            <div className="mt-5 space-y-1">

              {CANCEL_REASONS.map((reason) => {

                const Icon = reason.icon;

                const selected =
                  selectedReason === reason.id;

                return (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() =>
                      setSelectedReason(reason.id)
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-2
                      py-3
                      text-left
                      transition
                      hover:bg-gray-50
                    "
                  >

                    <div className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      text-gray-700
                    ">
                      <Icon size={20} />
                    </div>


                    <span className="
                      min-w-0
                      flex-1
                      text-sm
                      font-medium
                      text-gray-900
                    ">
                      {reason.label}
                    </span>


                    {/* RADIO */}

                    <div className={`
                      flex
                      h-6
                      w-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      transition
                      ${
                        selected
                          ? "border-rose-500 bg-rose-500"
                          : "border-gray-300 bg-white"
                      }
                    `}>
                      {selected && (
                        <Check
                          size={14}
                          className="text-white"
                          strokeWidth={3}
                        />
                      )}
                    </div>

                  </button>
                );
              })}

            </div>


            {/* CANCEL BUTTON */}

            <button
              type="button"
              disabled={!selectedReason}
              onClick={handleConfirmCancel}
              className="
                mt-5
                w-full
                rounded-2xl
                bg-rose-500
                py-4
                text-[15px]
                font-bold
                text-white
                shadow-lg
                shadow-rose-500/20
                transition
                duration-200
                hover:bg-rose-600
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:bg-rose-100
                disabled:text-rose-300
                disabled:shadow-none
              "
            >
              Cancel ride
            </button>

          </div>

        </div>
      )}

    </div>
  );
}


/* =========================================================
   STATUS STEP
========================================================= */

function StatusStep({
  label,
  active = false,
}) {
  return (
    <div className="
      flex
      min-w-0
      flex-1
      flex-col
      items-center
    ">

      <div className={`
        flex
        h-3
        w-3
        rounded-full
        transition
        ${
          active
            ? "bg-rose-500 shadow-[0_0_0_5px_rgba(244,63,94,0.12)]"
            : "bg-gray-300"
        }
      `} />

      <span className={`
        mt-2
        whitespace-nowrap
        text-[10px]
        font-medium
        ${
          active
            ? "text-rose-500"
            : "text-gray-400"
        }
      `}>
        {label}
      </span>

    </div>
  );
}


/* =========================================================
   STATUS LINE
========================================================= */

function StatusLine() {
  return (
    <div className="
      mb-5
      h-[2px]
      flex-1
      bg-gray-200
    " />
  );
}