import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
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

  const filteredNearby = nearby?.filter(
    (near) => near.status === 'Approved'
  );


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
              <Text style={styles.modalTitle}>{selectedPartner.storeName}</Text>
              <Text>Status: {selectedPartner.status}</Text>
              <Text>
                Conversion: {selectedPartner.conversion} PHP per 1 point
              </Text>
              <Text>Total Customers: {selectedPartner.totalCustomers}</Text>
              <Text>
                Total Points Given: {selectedPartner.totalPointsGiven}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: width - 60,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeBtn: {
    backgroundColor: "#000",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  closeBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default GpsLocation;
