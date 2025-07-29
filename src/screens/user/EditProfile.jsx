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

const EditProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);

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
    user?.birthday ? new Date(user.birthday) : null
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

      <View style={styles.row}>
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

        <View style={styles.inputsContainer}>
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
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.birthday}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.datePickerText}>
            {birthday
              ? `Birthday: ${formatDate(birthday)}`
              : "Select your birthday"}
          </Text>
          <Ionicons name="calendar" size={20} color="#000" />
        </View>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={birthday || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity
        style={styles.input}
        onPress={() => setMapVisible(true)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            width: "100%",
            paddingHorizontal: 5,
          }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.subtext, { maxWidth: "85%" }]} // set maxWidth to control layout
          >
            {address}
          </Text>
          <Ionicons name="map" size={20} color="#000" />
        </View>
      </TouchableOpacity>

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
    flex: 1, // take up the full height
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  avatarPicker: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderColor: "#000",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 45,
  },
  avatarText: {
    color: "#000",
    fontSize: 12,
    textAlign: "center",
  },
  inputsContainer: {
    flex: 1,
    marginLeft: 15,
  },
  input: {
    height: 50,
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    justifyContent: "center",
    color: "#000", // helps ensure vertical centering
  },
  birthday: {
    height: 50,
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    justifyContent: "center",
  },
  datePickerText: {
    color: "#000",
    alignSelf: "center",
  },
  subtext: {
    fontSize: 14,
    color: "#000",
    marginTop: 4,
    flexWrap: "wrap",
    maxWidth: 200,
  },
  button: {
    backgroundColor: "#000",
    borderColor: "#000",
    borderWidth: 2,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  locBtn: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  saveButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
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
  miniMap: {
    width: "100%",
    height: 150,
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: "row",
    padding: 10,
  },
  searchButton: {
    backgroundColor: "#424242",
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
  },
});

export default EditProfile;
