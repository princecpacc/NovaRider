import {
  useEffect,
  useRef,
  useState,
} from "react";

import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import {
  createVehicleMarker,
} from "./vehicleMarker";

mapboxgl.accessToken =
  import.meta.env.VITE_MAPBOX_TOKEN;

const DEFAULT_CENTER = [
  77.5946,
  12.9716,
];

export default function MapView({
  userLocation,
  pickupLocation,
  destinationLocation,
  route,
  captainLocation,
  userVehicleType,
}) {

  const mapContainerRef =
    useRef(null);

  const mapRef =
    useRef(null);

  const userMarkerRef =
    useRef(null);

  const captainMarkerRef =
    useRef(null);

  const pickupMarkerRef =
    useRef(null);

  const destinationMarkerRef =
    useRef(null);

  const captainAnimationRef =
    useRef(null);

  const [mapLoaded, setMapLoaded] =
    useState(false);


  // =====================================================
  // CREATE MAP
  // =====================================================

  useEffect(() => {

    if (!mapContainerRef.current) {
      return;
    }

    if (mapRef.current) {
      return;
    }

    const map =
      new mapboxgl.Map({
        container:
          mapContainerRef.current,

        style:
          "mapbox://styles/mapbox/streets-v12",

        center:
          DEFAULT_CENTER,

        zoom: 13,
      });

    mapRef.current = map;

    map.on("load", () => {

      console.log(
        "MAPBOX MAP LOADED"
      );

      setMapLoaded(true);
    });


    return () => {

      if (
        captainAnimationRef.current
      ) {
        cancelAnimationFrame(
          captainAnimationRef.current
        );
      }

      if (
        userMarkerRef.current
      ) {
        userMarkerRef.current.remove();
      }

      if (
        captainMarkerRef.current
      ) {
        captainMarkerRef.current.remove();
      }

      if (
        pickupMarkerRef.current
      ) {
        pickupMarkerRef.current.remove();
      }

      if (
        destinationMarkerRef.current
      ) {
        destinationMarkerRef.current.remove();
      }

      map.remove();

      mapRef.current = null;

      setMapLoaded(false);
    };

  }, []);


  // =====================================================
  // MOVE MAP TO USER
  // =====================================================

  useEffect(() => {

    const map =
      mapRef.current;

    if (
      !map ||
      !userLocation
    ) {
      return;
    }

    map.flyTo({
      center: [
        userLocation.lng,
        userLocation.lat,
      ],

      zoom: 16,

      duration: 1000,

      essential: true,
    });

  }, [userLocation]);


  // =====================================================
  // USER / PICKUP / DESTINATION MARKERS
  // =====================================================

  useEffect(() => {

    const map =
      mapRef.current;

    if (
      !map ||
      !mapLoaded
    ) {
      return;
    }


    // -----------------------------------------------
    // Remove previous markers
    // -----------------------------------------------

    if (
      userMarkerRef.current
    ) {

      userMarkerRef.current.remove();

      userMarkerRef.current = null;
    }


    if (
      pickupMarkerRef.current
    ) {

      pickupMarkerRef.current.remove();

      pickupMarkerRef.current = null;
    }


    if (
      destinationMarkerRef.current
    ) {

      destinationMarkerRef.current.remove();

      destinationMarkerRef.current =
        null;
    }


    // =================================================
    // USER
    // =================================================

    if (userLocation) {

      const element =
        document.createElement(
          "div"
        );

      element.className =
        "novaride-user-marker";

      element.innerHTML = `
        <div class="novaride-user-pulse">
          <div class="novaride-user-dot"></div>
        </div>
      `;

      userMarkerRef.current =
        new mapboxgl.Marker({
          element,
          anchor: "center",
        })
          .setLngLat([
            Number(
              userLocation.lng
            ),

            Number(
              userLocation.lat
            ),
          ])
          .addTo(map);
    }


    // =================================================
    // PICKUP
    // =================================================

    if (pickupLocation) {

      const element =
        document.createElement(
          "div"
        );

      element.className =
        "novaride-pickup-marker";

      element.innerHTML = `
        <div class="novaride-pickup-dot"></div>
      `;

      pickupMarkerRef.current =
        new mapboxgl.Marker({
          element,
          anchor: "center",
        })
          .setLngLat([
            Number(
              pickupLocation.lng
            ),

            Number(
              pickupLocation.lat
            ),
          ])
          .addTo(map);
    }


    // =================================================
    // DESTINATION
    // =================================================

    if (
      destinationLocation
    ) {

      const element =
        document.createElement(
          "div"
        );

      element.className =
        "novaride-destination-marker";

      element.innerHTML = `
        <div class="novaride-destination-pin">
          <div class="novaride-destination-dot"></div>
        </div>
      `;

      destinationMarkerRef.current =
        new mapboxgl.Marker({
          element,
          anchor: "bottom",
        })
          .setLngLat([
            Number(
              destinationLocation.lng
            ),

            Number(
              destinationLocation.lat
            ),
          ])
          .addTo(map);
    }

  }, [
    mapLoaded,
    userLocation,
    pickupLocation,
    destinationLocation,
  ]);


  // =====================================================
  // CAPTAIN VEHICLE
  // =====================================================

  useEffect(() => {

    const map =
      mapRef.current;

    if (
      !map ||
      !mapLoaded ||
      !captainLocation
    ) {
      return;
    }

    const longitude =
      Number(
        captainLocation.longitude
      );

    const latitude =
      Number(
        captainLocation.latitude
      );


    if (
      !Number.isFinite(longitude) ||
      !Number.isFinite(latitude)
    ) {
      return;
    }


    // =================================================
    // FIRST LOCATION
    // =================================================

    if (
      !captainMarkerRef.current
    ) {

      const marker =
        createVehicleMarker(
          userVehicleType
        );

      marker
        .setLngLat([
          longitude,
          latitude,
        ])
        .addTo(map);

      captainMarkerRef.current =
        marker;

      console.log(
        "🚕 VEHICLE MARKER CREATED:",
        {
          longitude,
          latitude,
        }
      );

      return;
    }


    // =================================================
    // SMOOTH MOVEMENT
    // =================================================

    const marker =
      captainMarkerRef.current;

    const start =
      marker.getLngLat();


    const startLng =
      start.lng;

    const startLat =
      start.lat;


    // Cancel previous animation

    if (
      captainAnimationRef.current
    ) {

      cancelAnimationFrame(
        captainAnimationRef.current
      );
    }


    const duration = 1200;

    const startTime =
      performance.now();


    const animate =
      (currentTime) => {

        const elapsed =
          currentTime -
          startTime;

        const progress =
          Math.min(
            elapsed / duration,
            1
          );


        // Ease-in-out
        const eased =
          progress < 0.5
            ? 2 *
              progress *
              progress
            : 1 -
              Math.pow(
                -2 *
                  progress +
                  2,
                2
              ) /
                2;


        const currentLng =
          startLng +
          (longitude -
            startLng) *
            eased;


        const currentLat =
          startLat +
          (latitude -
            startLat) *
            eased;


        marker.setLngLat([
          currentLng,
          currentLat,
        ]);


        if (
          progress < 1
        ) {

          captainAnimationRef.current =
            requestAnimationFrame(
              animate
            );

        } else {

          captainAnimationRef.current =
            null;
        }
      };


    captainAnimationRef.current =
      requestAnimationFrame(
        animate
      );


    console.log(
      "🚕 VEHICLE MOVING:",
      {
        from: {
          longitude: startLng,
          latitude: startLat,
        },

        to: {
          longitude,
          latitude,
        },
      }
    );

  }, [
    mapLoaded,
    captainLocation,
    userVehicleType,
  ]);


  // =====================================================
  // ROUTE
  // =====================================================

  useEffect(() => {

    const map =
      mapRef.current;

    if (
      !map ||
      !mapLoaded
    ) {
      return;
    }

    const sourceId =
      "novaride-route-source";

    const layerId =
      "novaride-route-layer";


    if (
      map.getLayer(layerId)
    ) {

      map.removeLayer(
        layerId
      );
    }


    if (
      map.getSource(sourceId)
    ) {

      map.removeSource(
        sourceId
      );
    }


    if (
      !route ||
      !route.coordinates ||
      route.coordinates.length === 0
    ) {

      return;
    }


    const routeGeoJSON = {

      type: "Feature",

      properties: {},

      geometry: {

        type: "LineString",

        coordinates:
          route.coordinates,
      },
    };


    map.addSource(
      sourceId,
      {
        type: "geojson",
        data: routeGeoJSON,
      }
    );


    map.addLayer({

      id: layerId,

      type: "line",

      source: sourceId,

      layout: {
        "line-join":
          "round",

        "line-cap":
          "round",
      },

      paint: {

        "line-color":
          "#f43f5e",

        "line-width":
          6,

        "line-opacity":
          0.9,
      },
    });


    const bounds =
      new mapboxgl.LngLatBounds();


    route.coordinates.forEach(
      (coordinate) => {
        bounds.extend(
          coordinate
        );
      }
    );


    map.fitBounds(
      bounds,
      {
        padding: {
          top: 100,
          bottom: 300,
          left: 60,
          right: 60,
        },

        duration: 900,

        maxZoom: 15,
      }
    );


    return () => {

      if (
        map.getLayer(layerId)
      ) {

        map.removeLayer(
          layerId
        );
      }


      if (
        map.getSource(sourceId)
      ) {

        map.removeSource(
          sourceId
        );
      }
    };

  }, [
    mapLoaded,
    route,
  ]);


  return (
    <>
      <div
        ref={mapContainerRef}
        className="h-full w-full"
      />

      <style>
        {`

          .novaride-user-marker {
            width: 34px;
            height: 34px;

            display: flex;
            align-items: center;
            justify-content: center;
          }


          .novaride-user-pulse {
            width: 34px;
            height: 34px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;

            background:
              rgba(244, 63, 94, 0.18);

            position: relative;
          }


          .novaride-user-pulse::before {
            content: "";

            position: absolute;

            width: 100%;
            height: 100%;

            border-radius: 50%;

            background:
              rgba(244, 63, 94, 0.25);

            animation:
              novaride-pulse
              1.8s ease-out infinite;
          }


          @keyframes novaride-pulse {

            0% {
              transform:
                scale(1);

              opacity:
                0.8;
            }

            70% {
              transform:
                scale(3.4);

              opacity:
                0.1;
            }

            100% {
              transform:
                scale(3.4);

              opacity:
                0;
            }
          }


          .novaride-user-dot {

            width: 12px;
            height: 12px;

            border-radius: 50%;

            background:
              #f43f5e;

            border:
              3px solid white;

            box-shadow:
              0 2px 8px
              rgba(0, 0, 0, 0.25);
          }


          .novaride-pickup-marker {

            width: 26px;
            height: 26px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;

            background: white;

            box-shadow:
              0 2px 8px
              rgba(0, 0, 0, 0.25);
          }


          .novaride-pickup-dot {

            width: 12px;
            height: 12px;

            border-radius: 50%;

            background:
              #f43f5e;

            border:
              2px solid white;
          }


          .novaride-destination-marker {

            width: 34px;
            height: 44px;

            display: flex;
            align-items: center;
            justify-content: center;
          }


          .novaride-destination-pin {

            width: 23px;
            height: 23px;

            display: flex;
            align-items: center;
            justify-content: center;

            background:
              #111;

            border:
              3px solid white;

            border-radius:
              50% 50% 50% 0;

            transform:
              rotate(-45deg);

            box-shadow:
              0 2px 8px
              rgba(0, 0, 0, 0.25);
          }


          .novaride-destination-dot {

            width: 6px;
            height: 6px;

            border-radius: 50%;

            background:
              white;
          }


          .novaride-vehicle-marker {

            

            display: flex;

            align-items: center;
            justify-content: center;

            

            

            

           
            overflow: hidden;
          }


          .novaride-vehicle-image {

            width: 42px;
            height: 42px;

            object-fit: contain;

            user-select: none;

            pointer-events: none;

            display: block;
          }

        `}
      </style>
    </>
  );
}