import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import useLocation from "../../hooks/useLocation";
import { useDispatch, useSelector } from "react-redux";
import MapView, { Marker } from "react-native-maps";
import { getNearbyPartners } from "../../redux/actions/partnerAction";

const GpsLocation = () => {
  const { latitude, longitude, errorMsg, startTracking, stopTracking } =
    useLocation();
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const { nearby } = useSelector((state) => state.partners);

  const [isTracking, setIsTracking] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    startTracking();
    return () => {
      stopTracking();
    };
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      const data = { latitude, longitude };
      dispatch(getNearbyPartners(data));
    }
  }, [latitude, longitude]);

  const handleStopTracking = () => {
    stopTracking();
    setIsTracking(false);
  };

  const handleStartTracking = () => {
    startTracking();
    setIsTracking(true);
  };

  const handleMarkerPress = (partner) => {
    setSelectedPartner(partner);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPartner(null);
  };

  const centerMap = () => {
    if (mapRef.current && latitude && longitude) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    }
  };

  const filteredNearby = nearby?.filter((near) => near.status === "Approved");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Location</Text>

      {isTracking && latitude && longitude ? (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation
          >
            <Marker coordinate={{ latitude, longitude }} title="You are here" />

            {filteredNearby?.map((partner) => (
              <Marker
                key={partner._id}
                coordinate={{
                  latitude: partner.location.coordinates[1],
                  longitude: partner.location.coordinates[0],
                }}
                title={partner.storeName}
                description={partner.status}
                onPress={() => handleMarkerPress(partner)}
              />
            ))}
          </MapView>

          <Text style={styles.coords}>
            Latitude: {latitude.toFixed(6)} | Longitude: {longitude.toFixed(6)}
          </Text>

          <TouchableOpacity style={styles.stopBtn} onPress={handleStopTracking}>
            <Text style={styles.stopBtnText}>Stop Tracking</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.startBtn} onPress={centerMap}>
            <Text style={styles.startBtnText}>Recenter</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.startBtn} onPress={handleStartTracking}>
          <Text style={styles.startBtnText}>Start Tracking</Text>
        </TouchableOpacity>
      )}

      {selectedPartner && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Image
                source={{ uri: selectedPartner.avatar?.url }}
                style={styles.partnerLogo}
                resizeMode="contain"
              />

              <View style={styles.nameStatusRow}>
                <Text style={styles.storeName}>
                  {selectedPartner.storeName}
                </Text>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        selectedPartner.status === "Approved"
                          ? "#4caf50"
                          : "#f44336",
                    },
                  ]}
                />
              </View>

              <Text style={styles.conversionText}>
                💱 {selectedPartner.conversion} pts = 1 PHP
              </Text>

              <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    color: "#1a1a1a",
    marginBottom: 10,
  },
  map: {
    width: width - 40,
    height: height / 2,
    borderRadius: 10,
  },
  coords: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  stopBtn: {
    backgroundColor: "#ff3333",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  stopBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  startBtn: {
    backgroundColor: "#000",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  startBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 10,
  },
  partnerLogo: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 15,
  },
  nameStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  storeName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginRight: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  conversionText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  closeBtn: {
    backgroundColor: "#007aff",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  closeBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default GpsLocation;
