import { useState, useRef } from "react";
import * as Location from "expo-location";

const useLocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const locationSubscription = useRef(null); // 💡 persist this for entire app session
  const [isTracking, setIsTracking] = useState(false);

  const startTracking = async () => {
    if (locationSubscription.current) {
      console.log("Already tracking, skipping new watcher.");
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permission to access location was not granted");
      return;
    }

    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 0,
      },
      (location) => {
        const { latitude, longitude } = location.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        console.log(`[Tracking] Location updated: ${latitude}, ${longitude}`);
      }
    );
    setIsTracking(true);
    console.log("Started tracking...");
  };

  const stopTracking = () => {
    console.log("Removing location watcher...");
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
      setIsTracking(false);
      console.log("Location tracking stopped.");
    } else {
      console.log("No active location watcher to remove.");
    }
  };

  return {
    latitude,
    longitude,
    isTracking,
    startTracking,
    stopTracking,
  };
};

export default useLocation;
