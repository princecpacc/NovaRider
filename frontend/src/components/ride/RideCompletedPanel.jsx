import { Star } from "lucide-react";
import { useState } from "react";

export default function RideCompletedPanel({
  ride,
  onDone,
}) {
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState(0);

  return (
    <div className="h-full overflow-y-auto px-5 pb-6 pt-3">

      <div className="text-center">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-2xl">
          🎉
        </div>

        <h2 className="mt-3 text-[20px] font-bold text-gray-950">
          You've arrived!
        </h2>

        <p className="mt-1 text-[11px] text-gray-500">
          Trip completed
        </p>

      </div>

      {/* FARE */}

      <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-center">

        <p className="text-[11px] text-gray-400">
          TOTAL FARE
        </p>

        <p className="mt-1 text-2xl font-black text-gray-950">
          ₹{ride?.fare}
        </p>

      </div>

      {/* RATING */}

      <div className="mt-6 text-center">

        <p className="text-[14px] font-bold text-gray-950">
          How was your ride?
        </p>

        <div className="mt-4 flex justify-center gap-2">

          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
            >
              <Star
                size={27}
                fill={
                  value <= rating
                    ? "currentColor"
                    : "none"
                }
                className={
                  value <= rating
                    ? "text-rose-500"
                    : "text-gray-300"
                }
              />
            </button>
          ))}

        </div>

      </div>

      {/* TIP */}

      <div className="mt-6">

        <p className="text-center text-[12px] font-semibold text-gray-700">
          Tip your captain
        </p>

        <div className="mt-3 flex gap-2">

          {[10, 20, 50].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTip(value)}
              className={`
                flex-1
                rounded-xl
                border
                py-3
                text-[12px]
                font-semibold

                ${
                  tip === value
                    ? "border-rose-500 bg-rose-50 text-rose-500"
                    : "border-gray-200 text-gray-700"
                }
              `}
            >
              ₹{value}
            </button>
          ))}

        </div>

      </div>

      <button
        type="button"
        disabled={!rating}
        onClick={onDone}
        className="
          mt-6
          w-full
          rounded-2xl
          bg-rose-500
          py-4
          text-sm
          font-bold
          text-white
          disabled:bg-gray-300
        "
      >
        Done
      </button>

    </div>
  );
}