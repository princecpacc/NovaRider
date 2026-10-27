import apiRequest from "./api";

const getCaptainHeaders = () => {
  const token = localStorage.getItem("captainToken");

  return {
    Authorization: `Bearer ${token}`,
     "Content-Type": "application/json",
  };
};

export const getAvailableRides = async () => {
  return await apiRequest("/rides/available", {
    method: "GET",
    headers: getCaptainHeaders(),
  });
};

export const acceptRide = async (rideId) => {
  return await apiRequest(`/rides/${rideId}/accept`, {
    method: "PATCH",
    headers: getCaptainHeaders(),
  });
};

export const updateRideStatus = async (rideId, status) => {
  return await apiRequest(`/rides/${rideId}/status`, {
    method: "PATCH",
    headers: getCaptainHeaders(),
    body: JSON.stringify({status})
  })
}

export const verifyRideOtp = async (rideId, otp) => {
  return await apiRequest(`/rides/${rideId}/verify-otp`, {
    method: "POST",
    headers: getCaptainHeaders(),
    body: JSON.stringify({otp})
  })
}