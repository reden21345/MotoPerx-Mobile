import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";

import { GOOGLE_MAPS_API } from "@env";
Geocoder.init(`${GOOGLE_MAPS_API}`);

// Pick Avatar
export const pickAvatar = async (setAvatar) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission Denied",
      "Permission to access gallery is required!"
    );
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.6,
  });

  if (!result.canceled && result.assets?.length > 0) {
    const asset = result.assets[0];

    const base64 = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const base64Image = `data:image/jpeg;base64,${base64}`;
    setAvatar(base64Image);
  }
};

// Pick multiple images
export const handlePickImages = async (setImages) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission Denied",
      "You need to grant camera roll permissions to upload images."
    );
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
  });

  if (!result.canceled && result.assets?.length > 0) {
    const base64Images = await Promise.all(
      result.assets.map(async (asset) => {
        const base64 = await FileSystem.readAsStringAsync(asset.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        return `data:image/jpeg;base64,${base64}`;
      })
    );

    setImages((prevImages) => [...prevImages, ...base64Images]);
  }
};

// Remove image from the array
export const handleRemoveImage = (index, setImages) => {
  setImages((prevImages) => prevImages.filter((_, i) => i !== index));
};

// Format Date
export const formatDate = (date) => {
  return date.toLocaleDateString();
};

// Fetch Current Location
export const fetchCurrentLocation = async (setRegion) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }

    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    setRegion({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    });
  } catch (error) {
    console.error("Error getting location:", error);
  }
};

// Get Address from reversing coordinates
export const getAddress = async (location, setAddress) => {
  if (!location) return;

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.warn("Permission to access location was denied");
    setAddress("Permission denied");
    return;
  }

  const reverseRegion = {
    latitude: location[1],
    longitude: location[0],
  };

  try {
    const response = await Location.reverseGeocodeAsync(reverseRegion);
    if (response && response.length > 0) {
      const { formattedAddress } = response[0];
      setAddress(`${formattedAddress}`);
    }
  } catch (error) {
    console.warn("Failed to reverse geocode:", error);
    setAddress("Unknown");
  }
};

// Search in google maps
export const handleMapSearch = async (searchQuery, setLocation, setRegion) => {
  try {
    const geoData = await Geocoder.from(searchQuery);
    const { lat, lng } = geoData.results[0].geometry.location;
    setLocation([lng, lat]);
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    });
  } catch (error) {
    console.error("Error during geocoding:", error);
  }
};
