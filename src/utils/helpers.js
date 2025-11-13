import * as DocumentPicker from "expo-document-picker";
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

// Pick Single Video
export const handlePickSingleVideo = async (setVideo) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
      copyToCacheDirectory: true,
    });

    console.log('Document Picker Result:', result); // Debug log

    // Handle cancellation
    if (result.canceled) {
      console.log('User canceled video selection');
      return;
    }

    // DocumentPicker now returns result.assets array
    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      
      // Check file size (e.g., max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (asset.size > maxSize) {
        Alert.alert(
          'Video too large',
          'Please choose a video smaller than 50MB.'
        );
        return;
      }

      try {
        console.log('Processing video:', asset.name);
        
        // Convert to base64
        const base64 = await FileSystem.readAsStringAsync(asset.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Get file extension
        const fileExtension = asset.name.split('.').pop().toLowerCase();
        const mimeType = getMimeType(fileExtension);

        const dataUri = `data:${mimeType};base64,${base64}`;

        console.log('Video processed successfully');

        // Set video with metadata
        setVideo({
          uri: asset.uri,
          name: asset.name,
          size: asset.size,
          mimeType: mimeType,
          base64: dataUri,
        });
      } catch (error) {
        console.error('Video processing error:', error);
        Alert.alert('Error', 'Failed to process video. Please try again.');
      }
    } else {
      console.log('No assets found in result');
    }
  } catch (error) {
    console.error('Video picker error:', error);
    Alert.alert('Error', 'Failed to pick video. Please try again.');
  }
};

// Helper function to get MIME type
const getMimeType = (extension) => {
  const mimeTypes = {
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    wmv: 'video/x-ms-wmv',
    flv: 'video/x-flv',
    mkv: 'video/x-matroska',
    webm: 'video/webm',
    m4v: 'video/x-m4v',
    '3gp': 'video/3gpp',
    mpeg: 'video/mpeg',
    mpg: 'video/mpeg',
  };

  return mimeTypes[extension] || 'video/mp4';
};

// Pick multiple videos
export const handlePickVideos = async (setVideos) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
      copyToCacheDirectory: true,
      multiple: true,
    });

    if (result.type === "cancel") {
      return;
    }

    if (result.type === "success") {
      const assets = Array.isArray(result) ? result : [result];
      const maxSize = 50 * 1024 * 1024; // 50MB per video

      const processedVideos = await Promise.all(
        assets.map(async (asset) => {
          try {
            // Check file size
            if (asset.size > maxSize) {
              Alert.alert(
                "Video too large",
                `${asset.name} is larger than 50MB and will be skipped.`
              );
              return null;
            }

            // Convert to base64
            const base64 = await FileSystem.readAsStringAsync(asset.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });

            const fileExtension = asset.name.split(".").pop().toLowerCase();
            const mimeType = getMimeType(fileExtension);
            const dataUri = `data:${mimeType};base64,${base64}`;

            return {
              uri: asset.uri,
              name: asset.name,
              size: asset.size,
              mimeType: mimeType,
              base64: dataUri,
            };
          } catch (error) {
            console.error(`Video processing error for ${asset.name}:`, error);
            return null;
          }
        })
      );

      // Filter out failed/null uploads
      const validVideos = processedVideos.filter(Boolean);
      setVideos((prevVideos) => [...prevVideos, ...validVideos]);
    }
  } catch (error) {
    console.error("Video picker error:", error);
    Alert.alert("Error", "Failed to pick videos. Please try again.");
  }
};

// Remove single video (reset to null)
export const handleRemoveSingleVideo = (setVideo) => {
  setVideo(null);
};

// Remove video from array
export const handleRemoveVideo = (index, setVideos) => {
  setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
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

export const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
