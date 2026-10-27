const fareRates = {
  bike: {
    base: 30,
    perKm: 8,
    perMinute: 0.5,
  },

  auto: {
    base: 40,
    perKm: 12,
    perMinute: 0.8,
  },

  car: {
    base: 60,
    perKm: 16,
    perMinute: 1,
  },
};

const getFare = (
  vehicleType,
  distanceKm,
  durationMinutes
) => {
  const rate = fareRates[vehicleType];

  if (!rate) {
    throw new Error("Invalid vehicle type");
  }

  const fare =
    rate.base +
    distanceKm * rate.perKm +
    durationMinutes * rate.perMinute;

  return Math.round(fare);
};

const getAllFares = (
  distanceKm,
  durationMinutes
) => {
  return {
    bike: getFare(
      "bike",
      distanceKm,
      durationMinutes
    ),

    auto: getFare(
      "auto",
      distanceKm,
      durationMinutes
    ),

    car: getFare(
      "car",
      distanceKm,
      durationMinutes
    ),
  };
};

module.exports = {
  getFare,
  getAllFares,
};