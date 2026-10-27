const VITE_API_URL =
  import.meta.env.VITE_API_URL;

export async function getFareEstimate({
  distanceKm,
  durationMinutes,
}) {
  if (
    distanceKm === undefined ||
    durationMinutes === undefined
  ) {
    throw new Error(
      "Distance and duration are required"
    );
  }

  const response = await fetch(
    `${VITE_API_URL}/rides/fare`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        distanceKm,
        durationMinutes,
      }),
    }
  );

  if (!response.ok) {
    const errorData =
      await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
        "Failed to calculate fare"
    );
  }

  return response.json();
}