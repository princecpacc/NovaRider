import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

export default function MapBounds({
  pickupLocation,
  destinationLocation,
}) {
  const map = useMap();

  useEffect(() => {
    if (
      !map ||
      !pickupLocation ||
      !destinationLocation
    ) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    bounds.extend({
      lat: pickupLocation.lat,
      lng: pickupLocation.lng,
    });

    bounds.extend({
      lat: destinationLocation.lat,
      lng: destinationLocation.lng,
    });

    map.fitBounds(bounds, {
      top: 100,
      right: 60,
      bottom: 300,
      left: 60,
    });
  }, [
    map,
    pickupLocation,
    destinationLocation,
  ]);

  return null;
}