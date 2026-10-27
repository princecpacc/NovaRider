import mapboxgl from "mapbox-gl";

const VEHICLE_IMAGES = {
  bike: "/images/novaride-bike.png",
  auto: "/images/novaride-auto.png",
  car: "/images/novaride-car.png",
};

export function createVehicleMarker(vehicleType = "car") {
  const element = document.createElement("div");

  element.className =
    "novaride-vehicle-marker";

  const image = document.createElement("img");

  image.src =
    VEHICLE_IMAGES[vehicleType] ||
    VEHICLE_IMAGES.car;

  image.alt =
    `NovaRide ${vehicleType}`;

  image.draggable = false;

  image.className =
    "novaride-vehicle-image";

  element.appendChild(image);

  const marker =
    new mapboxgl.Marker({
      element,
      anchor: "center",
    });

  return marker;
}