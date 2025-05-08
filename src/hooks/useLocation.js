import { useState, useRef } from "react";
import * as Location from "expo-location";

const useLocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const locationSubscription = useRef(null);

  const startTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was not granted");
        return;
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,       // every 5 seconds
          distanceInterval: 0,      // report even if not moved
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          console.log(`[Location Log] Lat: ${latitude}, Long: ${longitude}`);
        }
      );
    } catch (error) {
      setErrorMsg("Error starting location tracking");
      console.error(error);
    }
  };

  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  };

  return {
    latitude,
    longitude,
    errorMsg,
    startTracking,
    stopTracking,
  };
};

export default useLocation;