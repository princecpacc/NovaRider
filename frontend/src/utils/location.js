export const calculateDistanceMeters = (
  locationA,
  locationB
) => {

  if (
    !locationA ||
    !locationB
  ) {
    return Infinity;
  }


  const lat1 =
    Number(
      locationA.lat
    );

  const lng1 =
    Number(
      locationA.lng
    );

  const lat2 =
    Number(
      locationB.lat
    );

  const lng2 =
    Number(
      locationB.lng
    );


  if (
    !Number.isFinite(lat1) ||
    !Number.isFinite(lng1) ||
    !Number.isFinite(lat2) ||
    !Number.isFinite(lng2)
  ) {
    return Infinity;
  }


  const earthRadius =
    6371000;


  const lat1Rad =
    (lat1 * Math.PI) /
    180;

  const lat2Rad =
    (lat2 * Math.PI) /
    180;


  const deltaLat =
    ((lat2 - lat1) *
      Math.PI) /
    180;

  const deltaLng =
    ((lng2 - lng1) *
      Math.PI) /
    180;


  const a =
    Math.sin(
      deltaLat / 2
    ) **
      2 +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(
        deltaLng / 2
      ) **
        2;


  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );


  return (
    earthRadius * c
  );
};