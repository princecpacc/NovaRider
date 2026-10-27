import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

export default function RouteLayer({
  map,
  coordinates,
}) {
  useEffect(() => {
    if (
      !map ||
      !coordinates ||
      coordinates.length === 0
    ) {
      return;
    }

    const sourceId =
      "novaride-route";

    const layerId =
      "novaride-route-line";

    const routeData = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates,
      },
    };

    // -------------------------------
    // SOURCE
    // -------------------------------

    if (map.getSource(sourceId)) {
      map
        .getSource(sourceId)
        .setData(routeData);
    } else {
      map.addSource(sourceId, {
        type: "geojson",
        data: routeData,
      });
    }

    // -------------------------------
    // LINE
    // -------------------------------

    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,

        type: "line",

        source: sourceId,

        layout: {
          "line-join": "round",
          "line-cap": "round",
        },

        paint: {
          "line-color": "#f43f5e",
          "line-width": 6,
          "line-opacity": 0.9,
        },
      });
    }

    return () => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }

      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map, coordinates]);

  return null;
}