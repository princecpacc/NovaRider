const API_URL = import.meta.env.VITE_API_URL;

const getUserHeaders = () => {
  const token = localStorage.getItem("token");

  return {
     "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createRide = async ({
  pickup,
  destination,
  vehicleType,
  distanceKm,
  durationMinutes,
}) => {
  const token = localStorage.getItem("token");

  console.log(pickup,
        destination,
        vehicleType,
        distanceKm,
        durationMinutes)

  const response = await fetch(
    `${API_URL}/rides/create`,
    {
      method: "POST",
      headers: getUserHeaders(),
      body: JSON.stringify({
        pickup,
        destination,
        vehicleType,
        distanceKm,
        durationMinutes,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};


export const getCurrentRide = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/rides/current`, {
    method: "GET",
    headers: getUserHeaders()
  })
  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}