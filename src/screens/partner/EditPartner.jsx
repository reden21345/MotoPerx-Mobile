import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { editPartner } from "../../redux/actions/partnerAction";
import {
  pickAvatar,
  fetchCurrentLocation,
  getAddress,
  handleMapSearch,
} from "../../utils/helpers";

const EditPartner = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { partner, admin } = route.params;
  const { error } = useSelector((state) => state.partners);

  const [storeName, setStoreName] = useState(partner?.storeName || "");
  const [conversion, setConversion] = useState(
    partner?.conversion.toString() || ""
  );
  const [address, setAddress] = useState("No address...");
  const [location, setLocation] = useState(
    partner?.location?.coordinates ? partner.location.coordinates : null
  );
  const [avatar, setAvatar] = useState(partner?.avatar?.url || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [region, setRegion] = useState(null);
  const [editLoc, setEditLoc] = useState(false);

  const [mapVisible, setMapVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAddress(location, setAddress);
  }, [location]);

  useEffect(() => {
    fetchCurrentLocation(setRegion);
  }, []);

  const handleRegionChangeComplete = (newRegion) => {
    setLocation([newRegion.longitude, newRegion.latitude]);
    setRegion((prev) => ({
      ...prev,
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
      latitudeDelta: newRegion.latitudeDelta,
      longitudeDelta: newRegion.longitudeDelta,
    }));
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  const handleSubmit = async () => {
    if (!partner.avatar?.url && !avatar) {
      Alert.alert("Required", "Required to upload avatar!");
      return;
    }

    const data = {
      ...partner,
      storeName,
      conversion: Number(conversion),
      avatar,
      location,
    };

    setIsSubmitting(true);

    try {
      const result = await dispatch(editPartner(data));

      if (editPartner.fulfilled.match(result)) {
        Alert.alert("Success", "Partner store updated successfully");
        navigation.goBack();
      } else {
        Alert.alert("Update Failed", result.payload || "Something went wrong.");
      }
    } catch (err) {
      Alert.alert("Update Failed", err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
      <Text style={styles.title}>Edit Partner Shop</Text>

      <TouchableOpacity
        onPress={() => pickAvatar(setAvatar)}
        style={styles.avatarPicker}
        disabled={admin}
      >
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>Add Store Avatar</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={storeName}
        onChangeText={setStoreName}
        placeholder="StoreName"
      />

      <TextInput
        style={styles.input}
        value={conversion}
        onChangeText={setConversion}
        placeholder="Conversion rate"
        keyboardType="phone-pad"
      />

      {!admin && (
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          backgroundColor: "#D9D9D9", 
          borderColor: "#98DB52",
          borderWidth: 3,
          borderRadius: 10,
          paddingHorizontal: 15,
          height: 50,
          width: "100%",
          marginBottom: 20
        }}>
          <Text style={styles.subtext} numberOfLines={1} ellipsizeMode="tail">
            {address || "Pick Location"}
          </Text>
          <TouchableOpacity onPress={() => setMapVisible(true)}>
            <Ionicons name="map" size={20} color="#98DB52" />
          </TouchableOpacity>
        </View>

      )}

      <Modal visible={mapVisible} animationType="slide">
        {/* <View style={styles.searchContainer}>
          <TextInput
            style={styles.input2}
            placeholder="Search Location"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            onPress={() => handleMapSearch(searchQuery, setLocation, setRegion)}
            style={styles.searchButton}
          >
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View> */}
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
          onPress={() => {
            setMapVisible(false);
            setEditLoc(true);
          }}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </Modal>

      {editLoc && (
        <MapView style={styles.miniMap} region={region}>
          <Marker coordinate={region} />
        </MapView>
      )}

      <TouchableOpacity
        style={[styles.button, isSubmitting && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Text style={styles.buttonText}>Saving...</Text>
        ) : (
          <Text style={styles.buttonText}>Save Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    padding: 20,
    alignItems: "center", // Center the content
  },
  title: {
    display: "none", // Hide the "Edit Partner Shop" title
  },
  avatarPicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#98DB52", // Blue border
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    borderColor: "#98DB52",
    borderWidth: 3,
    paddingHorizontal: 15,
    fontSize: 14,
    paddingHorizontal: 15,
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  subtext: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
  },
  miniMap: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
    borderColor: "#98DB52",
    borderWidth: 3,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  map: {
    width: "100%",
    height: "90%",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 10,
  },
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
  saveButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#424242",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
    zIndex: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});


export default EditPartner;
