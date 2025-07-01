import { useState, useRef } from "react";
import * as Location from "expo-location";
import haversine from "haversine-distance";

const useLocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [startLoc, setStartLoc] = useState(null);
  const [endLoc, setEndLoc] = useState(null);
  const [kph, setKph] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);

  const [startTime, setStartTime] = useState(null);

  const prevLoc = useRef(null);
  const locationSubscription = useRef(null);

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permission denied");
      return;
    }

    setStartTime(Date.now());

    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 1,
      },
      (location) => {
        const { latitude, longitude, speed } = location.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        setEndLoc({ latitude, longitude });

        if (!startLoc) {
          setStartLoc({ latitude, longitude });
        }

        if (prevLoc.current) {
          const dist = haversine(prevLoc.current, { latitude, longitude });
          setTotalDistance((prev) => prev + dist);

          const timeDiff =
            (location.timestamp - prevLoc.current.timestamp) / 1000;

          const speedKph = timeDiff > 0 ? (dist / timeDiff) * 3.6 : 0;
          setKph(Number(speedKph.toFixed(1)));
        } else {
          setKph(0);
        }

        prevLoc.current = {
          latitude,
          longitude,
          timestamp: location.timestamp,
        };
      }
    );

    setIsTracking(true);
  };

  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
      setIsTracking(false);
    }
  };

  const resetTrackingData = () => {
    setStartLoc(null);
    setEndLoc(null);
    setTotalDistance(0);
    setKph(0);
    setStartTime(null);
    prevLoc.current = null;
  };

  return {
    latitude,
    longitude,
    isTracking,
    startTracking,
    stopTracking,
    resetTrackingData,
    startLoc,
    endLoc,
    totalDistance,
    kph,
    startTime,
  };
};

export default useLocation;
