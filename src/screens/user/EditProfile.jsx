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
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "../../redux/actions/authAction";
import {
  pickAvatar,
  formatDate,
  fetchCurrentLocation,
  getAddress,
  handleMapSearch,
} from "../../utils/helpers";

const EditProfile = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { user } = route.params;
  const { error } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("No address...");
  const [location, setLocation] = useState(
    user?.location?.coordinates ? user.location.coordinates : null
  );
  const [avatar, setAvatar] = useState(user?.avatar?.url || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [region, setRegion] = useState(null);
  const [editLoc, setEditLoc] = useState(false);

  const [birthday, setBirthday] = useState(
    user?.birthday ? new Date(user.birthday) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

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
    const data = {
      name,
      email,
      phone,
      avatar,
      birthday,
      location,
    };

    if (!user.avatar?.url && !avatar) {
      Alert.alert("Required", "Required to upload avatar!");
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(editProfile(data)).unwrap();
      Alert.alert("Success", "Profile updated successfully");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Update Failed", err || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TouchableOpacity
        onPress={() => pickAvatar(setAvatar)}
        style={styles.avatarPicker}
      >
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>Add Avatar</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone"
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.birthday}
      >
        <Text style={styles.datePickerText}>
          Birthday: {formatDate(birthday)}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={birthday}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={styles.subtext} numberOfLines={3} ellipsizeMode="tail">
          {address}
        </Text>
        <TouchableOpacity onPress={() => setMapVisible(true)}>
          <Ionicons name="map" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <Modal visible={mapVisible} animationType="slide">
        <View style={styles.searchContainer}>
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
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 30, // ensures room to scroll
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#007bff",
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
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  birthday: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  input2: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 5,
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
    zIndex: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  map: {
    width: "100%",
    height: "90%",
  },
  searchContainer: { flexDirection: "row", padding: 10 },
  searchButton: {
    backgroundColor: "#424242",
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
  },
  miniMap: {
    width: "100%",
    height: 150,
    marginVertical: 10,
  },
  datePickerText: {
    color: "#000",
    alignSelf: "center",
  },
  subtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    flexWrap: "wrap",
    maxWidth: 200,
  },
});

export default EditProfile;
