const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN;

export async function searchLocation(query) {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 3) {
    return [];
  }

  const url =
    "https://api.mapbox.com/search/geocode/v6/forward" +
    `?q=${encodeURIComponent(trimmedQuery)}` +
    "&autocomplete=true" +
    "&limit=5" +
    "&language=en" +
    "&country=IN" +
    `&access_token=${MAPBOX_TOKEN}`;

  console.log("LOCATION SEARCH:", trimmedQuery);

  try {
    const response = await fetch(url);

    console.log(
      "LOCATION RESPONSE STATUS:",
      response.status
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          `Mapbox search failed: ${response.status}`
      );
    }

    console.log(
      "LOCATION API RESPONSE:",
      data
    );

    return (data.features || []).map(
      (feature) => {
        const coordinates =
          feature.geometry?.coordinates || [];

        const lng = Number(coordinates[0]);
        const lat = Number(coordinates[1]);

        return {
          id: feature.id,

          name:
            feature.properties?.name ||
            feature.text ||
            "Unknown location",

          display_name:
            feature.properties?.full_address ||
            feature.place_name ||
            feature.properties?.name ||
            "Location",

          lat,
          lng,
        };
      }
    );
  } catch (error) {
    console.error(
      "LOCATION SEARCH ERROR:",
      error
    );

    throw error;
  }
}