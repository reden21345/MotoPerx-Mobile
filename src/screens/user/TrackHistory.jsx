import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getTrackingHistory } from "../../redux/actions/trackingAction";
import MapView, { Marker, Polyline } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const formatDuration = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
};

const TrackHistory = () => {
  const dispatch = useDispatch();
  const { tracks, loading, error } = useSelector((state) => state.tracks);

  useEffect(() => {
    dispatch(getTrackingHistory());
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#98DB52" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Track History</Text>

      {tracks?.length === 0 ? (
        <Text style={styles.noData}>No tracking data available.</Text>
      ) : (
        tracks.map((track, index) => {
          const start = {
            latitude: track.startLoc.coordinates[1],
            longitude: track.startLoc.coordinates[0],
          };
          const end = {
            latitude: track.endLoc.coordinates[1],
            longitude: track.endLoc.coordinates[0],
          };

          const region = {
            latitude: (start.latitude + end.latitude) / 2,
            longitude: (start.longitude + end.longitude) / 2,
            latitudeDelta:
              Math.abs(start.latitude - end.latitude) * 2 || 0.01,
            longitudeDelta:
              Math.abs(start.longitude - end.longitude) * 2 || 0.01,
          };

          return (
            <View key={index} style={styles.card}>
              <MapView
                style={styles.map}
                region={region}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                pointerEvents="none"
              >
                <Marker coordinate={start} pinColor="green" />
                <Marker coordinate={end} pinColor="red" />
                <Polyline
                  coordinates={[start, end]}
                  strokeColor="#98DB52"
                  strokeWidth={4}
                />
              </MapView>

              <View style={styles.info}>
                <View style={styles.row}>
                  <Icon name="calendar" size={20} color="#98DB52" />
                  <Text style={styles.text}>
                    {new Date(track.date).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Icon name="map-marker-distance" size={20} color="#98DB52" />
                  <Text style={styles.text}>
                    Distance: {(track.distance / 1000).toFixed(2)} km
                  </Text>
                </View>
                <View style={styles.row}>
                  <Icon name="speedometer" size={20} color="#98DB52" />
                  <Text style={styles.text}>Speed: {track.kph} kph</Text>
                </View>
                <View style={styles.row}>
                  <Icon name="timer" size={20} color="#98DB52" />
                  <Text style={styles.text}>
                    Duration: {formatDuration(track.duration || 0)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#121212",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  map: {
    height: 150,
    width: "100%",
  },
  info: {
    padding: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    marginLeft: 10,
    color: "#333",
  },
  noData: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default TrackHistory;
