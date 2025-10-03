import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import * as ImageManipulator from "expo-image-manipulator";
import Geocoder from "react-native-geocoding";
import { Alert } from "react-native";
import Constants from "expo-constants";

const googleKey = 
  Constants.expoConfig?.extra?.GOOGLE_MAPS_API ||
  Constants.manifest?.extra?.GOOGLE_MAPS_API ||
  Constants.manifest2.extra?.GOOGLE_MAPS_API;
  
Geocoder.init(`${googleKey}`);

// Pick and compress avatar image
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
    quality: 1, // pick highest quality before manual compression
  });

  if (!result.canceled && result.assets?.length > 0) {
    try {
      const asset = result.assets[0];

      // 🗜 Resize & compress the image
      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );

      // 📥 Convert to base64
      const base64 = await FileSystem.readAsStringAsync(manipulated.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const base64Image = `data:image/jpeg;base64,${base64}`;

      // Optional size warning
      if (base64Image.length > 1500000) {
        Alert.alert("Image too large", "Please choose a smaller image.");
        return;
      }

      setAvatar(base64Image);
    } catch (error) {
      console.error("Avatar processing error:", error);
      Alert.alert("Error", "Failed to process selected image.");
    }
  }
};

// Pick and compress images
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
    quality: 1,
  });

  if (!result.canceled && result.assets?.length > 0) {
    const base64Images = await Promise.all(
      result.assets.map(async (asset) => {
        try {
          // 🗜 Resize and compress image
          const compressed = await ImageManipulator.manipulateAsync(
            asset.uri,
            [{ resize: { width: 800 } }],
            { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
          );

          // 📥 Convert to base64
          const base64 = await FileSystem.readAsStringAsync(compressed.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const dataUri = `data:image/jpeg;base64,${base64}`;

          // Optional: warn if still too large
          if (dataUri.length > 1500000) {
            Alert.alert("Image too large", "Please choose a smaller image.");
            return null;
          }

          return dataUri;
        } catch (error) {
          console.error("Image processing error:", error);
          return null;
        }
      })
    );

    // Filter out failed/null uploads
    const validImages = base64Images.filter(Boolean);
    setImages((prevImages) => [...prevImages, ...validImages]);
  }
};

export const handlePickSingleImage = async (setImage) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission Denied",
      "You need to grant camera roll permissions to upload an image."
    );
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: false, // ✅ Single image only
    quality: 1,
  });

  if (!result.canceled && result.assets?.length > 0) {
    try {
      const asset = result.assets[0];

      // 🗜 Resize and compress
      const compressed = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );

      // 📥 Convert to base64
      const base64 = await FileSystem.readAsStringAsync(compressed.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const dataUri = `data:image/jpeg;base64,${base64}`;

      // Warn if still too large
      if (dataUri.length > 1500000) {
        Alert.alert("Image too large", "Please choose a smaller image.");
        return;
      }

      setImage(dataUri); // ✅ Set single image
    } catch (error) {
      console.error("Image processing error:", error);
    }
  }
};

// Remove image from the array
export const handleRemoveImage = (index, setImages) => {
  setImages((prevImages) => prevImages.filter((_, i) => i !== index));
};

// Remove single image (reset to null)
export const handleRemoveSingleImage = (setImage) => {
  setImage(null);
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

export const getStatusStyle = (status) => {
  switch (status) {
    case "Approved":
      return { color: "#4CAF50", fontWeight: "bold" }; // green
    case "Disapproved":
      return { color: "#F44336", fontWeight: "bold" }; // red
    case "Pending":
    default:
      return { color: "#FFC107", fontWeight: "bold" }; // amber/yellow
  }
};

export const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${h}:${m}:${s}`;
};

export const formatDateWithAgo = (input) => {
    const date = new Date(input);
    const now = new Date();

    if (isNaN(date.getTime())) return "Invalid date";

    const seconds = Math.floor((now - date) / 1000);

    const pad = (n) => (n < 10 ? "0" + n : n);
    const formattedDate = `${pad(date.getMonth() + 1)}/${pad(
      date.getDate()
    )}/${date.getFullYear()}`;

    let ago = "Just now";
    if (seconds >= 1) {
      const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
      ];

      for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
          ago = `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
          break;
        }
      }
    }

    return `${formattedDate} • ${ago}`;
  };
