const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN;

export async function getRoute(
  pickup,
  destination
) {
  if (!pickup || !destination) {
    return null;
  }

  const pickupLng = Number(pickup.lng);
  const pickupLat = Number(pickup.lat);

  const destinationLng =
    Number(destination.lng);

  const destinationLat =
    Number(destination.lat);

  if (
    !Number.isFinite(pickupLng) ||
    !Number.isFinite(pickupLat) ||
    !Number.isFinite(destinationLng) ||
    !Number.isFinite(destinationLat)
  ) {
    throw new Error(
      "Invalid pickup or destination coordinates"
    );
  }

  const coordinates =
    `${pickupLng},${pickupLat};` +
    `${destinationLng},${destinationLat}`;

  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}` +
    `?alternatives=false` +
    `&geometries=geojson` +
    `&overview=full` +
    `&steps=false` +
    `&access_token=${MAPBOX_TOKEN}`;

  console.log("ROUTE REQUEST:", url);

  try {
    const response = await fetch(url);

    const data =
      await response.json();

    console.log(
      "ROUTE RESPONSE:",
      data
    );

    if (!response.ok) {
      throw new Error(
        data?.message ||
          `Route request failed: ${response.status}`
      );
    }

    if (
      data.code !== "Ok" ||
      !data.routes ||
      data.routes.length === 0
    ) {
      throw new Error(
        "No driving route found"
      );
    }

    const route = data.routes[0];

    return {
      // GeoJSON LineString coordinates
      coordinates:
        route.geometry.coordinates,

      distance:
        route.distance,

      duration:
        route.duration,

      distanceKm:
        route.distance / 1000,

      durationMinutes:
        Math.ceil(
          route.duration / 60
        ),
    };
  } catch (error) {
    console.error(
      "GET ROUTE ERROR:",
      error
    );

    throw error;
  }
}