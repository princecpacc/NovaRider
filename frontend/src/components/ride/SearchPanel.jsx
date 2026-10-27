import {
  ChevronDown,
  Navigation,
  Home,
  Briefcase,
  Clock3,
  ChevronRight,
} from "lucide-react";

export default function SearchPanel({
  pickup,
  destination,
  activeInput,
  setPickup,
  setDestination,
  handleInputFocus,
  handleSearch,
  suggestions,
  handleSuggestion,
  isExpanded,
  handleCollapse,
  handleCurrentLocation,
  inputsRef,
  lineRef,
  suggestionsRef,
}) {
  return (
    <div className="h-full overflow-y-auto px-5 pb-6 pt-3">

      {/* HEADER */}

      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-950">
          Find a ride
        </h1>

        {isExpanded && (
          <button
            type="button"
            onClick={handleCollapse}
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-full
              bg-gray-100
            "
          >
            <ChevronDown size={20} />
          </button>
        )}
      </div>


      {/* INPUTS */}

      <div className="relative">

        <div
          ref={lineRef}
          className="
            absolute
            left-[21px]
            top-[39px]
            z-10
            h-[29px]
            w-[2px]
            rounded-full
            bg-gray-400
          "
        />

        <div
          ref={inputsRef}
          className="
            relative
            z-20
            flex
            flex-col
            gap-2
          "
        >

          <LocationInput
            type="pickup"
            activeInput={activeInput}
            value={pickup}
            placeholder="Pickup location"
            onFocus={() =>
              handleInputFocus("pickup")
            }
            onChange={(event) => {
              setPickup(event.target.value);
              handleSearch(event.target.value);
            }}
          />


          <LocationInput
            type="destination"
            activeInput={activeInput}
            value={destination}
            placeholder="Where to?"
            onFocus={() =>
              handleInputFocus("destination")
            }
            onChange={(event) => {
              setDestination(event.target.value);
              handleSearch(event.target.value);
            }}
          />


          {suggestions.length > 0 && (
            <div
              className="
                mt-2
                overflow-hidden
                rounded-xl
                border
                border-gray-100
                bg-white
                shadow-lg
              "
            >
              {suggestions.map((place) => (
                <button
                  key={`${place.id}-${place.lat}-${place.lng}`}
                  type="button"
                  onClick={() =>
                    handleSuggestion(place)
                  }
                  className="
                    flex
                    w-full
                    items-start
                    gap-3
                    border-b
                    border-gray-100
                    px-4
                    py-3
                    text-left
                    last:border-b-0
                    hover:bg-gray-50
                  "
                >
                  <div className="min-w-0">

                    <p className="
                      truncate
                      text-sm
                      font-semibold
                      text-gray-900
                    ">
                      {place.name}
                    </p>

                    <p className="
                      mt-0.5
                      line-clamp-2
                      text-xs
                      text-gray-500
                    ">
                      {place.display_name || "Location"}
                    </p>

                  </div>
                </button>
              ))}
            </div>
          )}

        </div>
      </div>


      {/* EXPANDED */}

      {isExpanded && (
        <div
          ref={suggestionsRef}
          className="pt-4"
        >

          {/* CURRENT */}

          <div className="mt-2">

            <SectionTitle>
              Current
            </SectionTitle>

            <SuggestionItem
              icon={<Navigation size={19} />}
              title="Current location"
              subtitle="Use my current location"
              onClick={handleCurrentLocation}
            />

          </div>


          {/* SAVED */}

          <div className="mt-5">

            <SectionTitle>
              Saved places
            </SectionTitle>

            <SuggestionItem
              icon={<Home size={19} />}
              title="Home"
              subtitle="Add home address"
              onClick={() => {}}
            />

            <SuggestionItem
              icon={<Briefcase size={19} />}
              title="Work"
              subtitle="Add work address"
              onClick={() => {}}
            />

          </div>


          {/* RECENT */}

          <div className="mt-5">

            <SectionTitle>
              Recent
            </SectionTitle>

            <SuggestionItem
              icon={<Clock3 size={19} />}
              title="Bhilwara Railway Station"
              subtitle="Bhilwara, Rajasthan"
              onClick={() => {}}
            />

            <SuggestionItem
              icon={<Clock3 size={19} />}
              title="City Mall"
              subtitle="Recent destination"
              onClick={() => {}}
            />

          </div>

        </div>
      )}

    </div>
  );
}


function LocationInput({
  type,
  activeInput,
  value,
  placeholder,
  onFocus,
  onChange,
}) {
  const isActive = activeInput === type;

  return (
    <div
      className={`
        flex
        h-[48px]
        items-center
        gap-3
        rounded-xl
        border
        px-4
        transition-all

        ${
          isActive
            ? "border-rose-400 bg-white ring-2 ring-rose-100"
            : "border-transparent bg-gray-100"
        }
      `}
    >

      {type === "pickup" ? (
        <span className="
          h-3
          w-3
          shrink-0
          rounded-full
          bg-rose-500
        " />
      ) : (
        <span className="
          h-3
          w-3
          shrink-0
          bg-black
        " />
      )}

      <input
        type="text"
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          bg-transparent
          text-[15px]
          font-medium
          text-gray-950
          outline-none
          placeholder:font-normal
          placeholder:text-gray-500
        "
      />

    </div>
  );
}


function SectionTitle({ children }) {
  return (
    <p className="
      mb-1
      text-xs
      font-semibold
      uppercase
      tracking-[0.12em]
      text-gray-400
    ">
      {children}
    </p>
  );
}


function SuggestionItem({
  icon,
  title,
  subtitle,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        gap-3
        border-b
        border-gray-100
        py-3
        text-left
        hover:bg-gray-50
      "
    >

      <div className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-rose-50
        text-rose-500
      ">
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <p className="
          truncate
          text-sm
          font-semibold
          text-gray-950
        ">
          {title}
        </p>

        <p className="
          mt-0.5
          truncate
          text-xs
          text-gray-500
        ">
          {subtitle}
        </p>

      </div>

      <ChevronRight
        size={17}
        className="text-gray-300"
      />

    </button>
  );
}