import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import MapView, { Marker } from "react-native-maps";
import {
  apply,
  getPartner,
  updateStatus,
} from "../../redux/actions/partnerAction";
import {
  clearMessage,
  clearPartnerDetails,
} from "../../redux/slices/partnerSlice";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  fetchCurrentLocation,
  handleMapSearch,
  pickAvatar,
} from "../../utils/helpers";

const ApplyPartnership = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { partner, message, error, loading } = useSelector(
    (state) => state.partners
  );

  const [storeName, setStoreName] = useState("");
  const [location, setLocation] = useState([0, 0]);
  const [conversion, setConversion] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [region, setRegion] = useState(null);

  const [mapVisible, setMapVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (
      user?.role === "partner" ||
      user?.role === "employee" ||
      user?.role === "pendingPartner"
    ) {
      dispatch(getPartner());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (message) {
      Alert.alert("Success", `${message}`);
    }
  }, [message]);

  useEffect(() => {
    if (region) {
      setLocation([region.longitude, region.latitude]);
    }
  }, [region]);

  useEffect(() => {
    fetchCurrentLocation(setRegion);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        dispatch(clearMessage());
      };
    }, [dispatch])
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#424242" />
      </View>
    );
  }

  if (error) {
    Alert.alert("Error", error);
  }

  const handleApply = () => {
    const data = {
      storeName,
      location,
      conversion: Number(conversion),
      avatar,
    };

    dispatch(apply(data));
  };

  const handleCancel = () => {
    const data = {
      id: partner?._id,
      status: "Canceled",
    };
    console.log(data);
    dispatch(updateStatus(data)).then(() => {
      dispatch(clearPartnerDetails());
    });
  };

  const handleRegionChangeComplete = (newRegion) => {
    setRegion((prev) => ({
      ...prev,
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
      latitudeDelta: newRegion.latitudeDelta,
      longitudeDelta: newRegion.longitudeDelta,
    }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.outerContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.screenTitle}>Partner Application</Text>

        {!partner ? (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => pickAvatar(setAvatar)}
              style={styles.avatarPicker}
            >
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>Add Logo</Text>
              )}
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Store Name"
              value={storeName}
              onChangeText={setStoreName}
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Transaction Amount"
              keyboardType="numeric"
              value={conversion}
              onChangeText={setConversion}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity
              style={styles.locBtn}
              onPress={() => setMapVisible(true)}
            >
              <Text style={styles.buttonText}>Location</Text>
              <Ionicons
                name="map"
                size={20}
                color="white"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
            <Modal visible={mapVisible} animationType="slide">
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.input2}
                  placeholder="Search Location"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity
                  onPress={() =>
                    handleMapSearch(searchQuery, setLocation, setRegion)
                  }
                  style={styles.searchButton}
                >
                  <Ionicons name="search" size={20} color="white" />
                </TouchableOpacity>
              </View>
              {region ? (
                <MapView
                  style={styles.map}
                  initialRegion={region}
                  onRegionChangeComplete={handleRegionChangeComplete}
                >
                  <Marker coordinate={region} />
                </MapView>
              ) : (
                <ActivityIndicator size="large" color="#424242" />
              )}

              <TouchableOpacity
                onPress={() => setMapVisible(false)}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </Modal>

            {region ? (
              <MapView style={styles.miniMap} region={region}>
                <Marker coordinate={region} />
              </MapView>
            ) : (
              <ActivityIndicator size="large" color="#424242" />
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleApply}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Applying..." : "Apply"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : partner && partner.status === "Pending" ? (
          <View style={styles.pendingContainer}>
            <Text style={styles.pendingText}>Waiting for approval...</Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Cancelling..." : "Cancel"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.pendingContainer}>
            <Text style={styles.pendingText}>
              Sorry your application has been declined
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#424242",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fafafa",
  },
  submitButton: {
    backgroundColor: "#424242",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  locBtn: {
    backgroundColor: "#424242",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    position: "absolute", // Position it over the map
    bottom: 30, // Distance from the bottom of the screen
    alignSelf: "center", // Center horizontally
    backgroundColor: "#424242",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
    zIndex: 10, // Ensure it’s above the map
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  pendingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pendingText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#424242",
  },
  avatarPicker: {
    alignSelf: "center",
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    color: "#888",
    textAlign: "center",
  },
  map: {
    width: "100%",
    height: "90%",
  },
  searchContainer: { flexDirection: "row", padding: 10 },
  input2: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: "#424242",
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
  },
  searchText: { color: "#fff" },
  miniMap: {
    width: "100%",
    height: "20%",
  },
});

export default ApplyPartnership;
