const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN;

const DIRECTIONS_URL =
  "https://api.mapbox.com/directions/v5/mapbox/driving-traffic";


// ======================================================
// VALIDATE LOCATION
// ======================================================

const isValidLocation = (location) => {

  if (!location) {
    return false;
  }

  const lat = Number(location.lat);
  const lng = Number(location.lng);

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};


// ======================================================
// CALCULATE LIVE ROUTE
// ======================================================

export const getLiveRoute = async (
  currentLocation,
  destinationLocation,
  signal
) => {

  if (
    !isValidLocation(
      currentLocation
    )
  ) {
    throw new Error(
      "Invalid current location"
    );
  }


  if (
    !isValidLocation(
      destinationLocation
    )
  ) {
    throw new Error(
      "Invalid destination location"
    );
  }


  if (!MAPBOX_TOKEN) {

    throw new Error(
      "VITE_MAPBOX_TOKEN is missing"
    );
  }


  const startLng =
    Number(
      currentLocation.lng
    );

  const startLat =
    Number(
      currentLocation.lat
    );


  const destinationLng =
    Number(
      destinationLocation.lng
    );

  const destinationLat =
    Number(
      destinationLocation.lat
    );


  const coordinates =
    `${startLng},${startLat};${destinationLng},${destinationLat}`;


  const url =
    `${DIRECTIONS_URL}/${coordinates}` +
    `?alternatives=false` +
    `&overview=full` +
    `&geometries=geojson` +
    `&steps=true` +
    `&access_token=${MAPBOX_TOKEN}`;


  const response =
    await fetch(
      url,
      {
        signal,
      }
    );


  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      `Mapbox route request failed: ${response.status} ${errorText}`
    );
  }


  const data =
    await response.json();


  if (
    data.code !== "Ok" ||
    !data.routes?.length
  ) {

    throw new Error(
      data.message ||
      "No route found"
    );
  }


  const route =
    data.routes[0];


  return {

    coordinates:
      route.geometry.coordinates,

    duration:
      route.duration,

    distance:
      route.distance,

    durationMinutes:
      Math.max(
        1,
        Math.ceil(
          route.duration / 60
        )
      ),

    distanceKm:
      Number(
        (
          route.distance / 1000
        ).toFixed(2)
      ),

    raw: route,
  };
};


// ======================================================
// FORMAT ETA
// ======================================================

export const formatEta = (
  minutes
) => {

  if (
    minutes === null ||
    minutes === undefined ||
    !Number.isFinite(
      Number(minutes)
    )
  ) {
    return "--";
  }


  const value =
    Math.max(
      1,
      Math.ceil(
        Number(minutes)
      )
    );


  if (value < 60) {
    return `${value} min`;
  }


  const hours =
    Math.floor(
      value / 60
    );

  const remaining =
    value % 60;


  if (remaining === 0) {
    return `${hours} hr`;
  }


  return `${hours} hr ${remaining} min`;
};