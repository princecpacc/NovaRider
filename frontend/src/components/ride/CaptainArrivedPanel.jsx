import {
  Phone,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

export default function CaptainArrivedPanel({
  ride,
}) {
  const captain = ride?.captain;

  return (
    <div className="h-">

      <div className="text-center">

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
          <ShieldCheck
            size={25}
            className="text-rose-500"
          />
        </div>

        <h2 className="mt-3 text-[18px] font-bold text-gray-950">
          Your captain has arrived
        </h2>

        <p className="mt-1 text-[12px] text-gray-500">
          Please share the OTP with your captain
        </p>

      </div>

      {/* OTP */}

      <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-center">

        <p className="text-[11px] font-medium text-gray-400">
          PICKUP OTP
        </p>

        <p className="mt-2 text-3xl font-black tracking-[10px] text-gray-950">
          {ride?.otp}
        </p>

        <p className="mt-2 text-[10px] text-gray-400">
          Share this code only with your captain
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
            Your captain is waiting
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

        <button
          type="button"
          onClick={() =>
            window.location.href =
              `sms:${captain?.phone}`
          }
          className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500"
        >
          <MessageCircle size={16} />
        </button>

      </div>

    </div>
  );
}