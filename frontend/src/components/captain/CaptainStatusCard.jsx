import { ArrowRight, Power } from "lucide-react";

const CaptainStatusCard = ({
  isOnline,
  onToggleOnline,
}) => {
  return (
    <div className="absolute bottom-[78px] left-4 right-4 z-20">

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">

        <div className="flex flex-col text-center items-center justify-center">

          <div>
            <h2 className="text-[14px] font-bold text-gray-900">
              {isOnline
                ? "You are online"
                : "You are offline"}
            </h2>

            <p className="mt-1 max-w-[230px] text-[11px] leading-4 text-gray-500">
              {isOnline
                ? "You will receive ride requests soon"
                : "Go online to start receiving ride requests"}
            </p>
          </div>

          {!isOnline ? (
            <button
              type="button"
              onClick={onToggleOnline}
              className="flex h-11 w-full mx-auto min-w-[135px] mt-4 items-center justify-center gap-6 rounded-xl bg-rose-500 px-4 text-[14px] font-bold text-white shadow-[0_5px_18px_rgba(236,72,153,0.25)] transition active:scale-95"
            >
              GO ONLINE
                <ArrowRight size={15} />
              {/* <div className="h-6 w-6 rounded-full  flex items-center justify-center bg-white shadow-sm text-15 text-rose-500">
              </div> */}
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggleOnline}
              aria-label="Go offline"
              className="flex h-12 w-12 shrink-0  mt-4 items-center justify-center rounded-full bg-rose-500 text-white shadow-[0_5px_18px_rgba(236,72,153,0.25)] transition active:scale-95"
            >
              <Power size={22}  />
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default CaptainStatusCard;