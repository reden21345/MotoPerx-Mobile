import React, { useEffect, useState, useRef, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { getNearbyPartners } from "../../redux/actions/partnerAction";
import { getAddress } from "../../utils/helpers";

const GpsLocation = () => {
  const { latitude, longitude, isTracking, startTracking, stopTracking } =
    useLocation();
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const { nearby } = useSelector((state) => state.partners);

  const [selectedPartner, setSelectedPartner] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (isTracking) {
        startTracking();
      }

      return () => {
        if (isTracking) {
          stopTracking();
          console.log("GpsLocation screen blurred, tracking stopped");
        }
      };
    }, [isTracking])
  );

  useEffect(() => {
    if (isTracking && latitude && longitude) {
      dispatch(getNearbyPartners({ latitude, longitude }));
      getAddress([longitude, latitude], setAddress);
    }
  }, [latitude, longitude, isTracking]);

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

          <Text style={styles.coords}>{address}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.stopBtn}
              onPress={() => {
                stopTracking();
              }}
            >
              <Text style={styles.stopBtnText}>Stop Tracking</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.startBtn} onPress={centerMap}>
              <Text style={styles.startBtnText}>Recenter</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => {
            startTracking();
          }}
        >
          <Text style={styles.startBtnText}>Start Tracking</Text>
        </TouchableOpacity>
      )}

      {selectedPartner && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {selectedPartner.avatar?.url && (
                <Image
                  source={{ uri: selectedPartner.avatar.url }}
                  style={styles.partnerLogo}
                  resizeMode="contain"
                />
              )}
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
                💱 {selectedPartner.conversion} PHP = 1 point
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
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 15,
  },
  map: {
    width: width - 40,
    height: height / 2,
    borderRadius: 12,
    borderColor: "#98DB52",
    borderWidth: 1,
  },
  coords: {
    marginTop: 12,
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 20,
  },
  stopBtn: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 15,
    shadowColor: "#98DB52",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#98DB52",
  },
  stopBtnText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  startBtn: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 15,
    shadowColor: "#98DB52",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#98DB52",
  },
  startBtnText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },
  partnerLogo: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#98DB52",
  },
  nameStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  storeName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#98DB52",
    marginRight: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  conversionText: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 20,
  },
  closeBtn: {
    backgroundColor: "#98DB52",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#98DB52",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  closeBtnText: {
    color: "#121212",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default GpsLocation;
