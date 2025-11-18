import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { createAd } from "../../redux/actions/adsAction";
import { clearSuccess } from "../../redux/slices/adSlice";
import {
  handlePickSingleImageFile,
  handleRemoveSingleImage,
  handlePickSingleVideo,
  handleRemoveSingleVideo,
  formatFileSize,
} from "../../utils/helpers";
import { createAds as styles } from "../../styles/CreateAds";

const CreateAdScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, success, error, message } = useSelector(
    (state) => state.ads
  );

  const [company, setCompany] = useState("");
  const [caption, setCaption] = useState("");
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    if (success) {
      Alert.alert("Success", message || "Ad created successfully", [
        {
          text: "OK",
          onPress: () => {
            dispatch(clearSuccess());
            navigation.goBack();
          },
        },
      ]);
    }

    if (error) {
      Alert.alert("Error", error.message || "Failed to create ad");
      dispatch(clearSuccess());
    }
  }, [success, error, message]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const handleImagePick = async () => {
    setUploadingImage(true);
    await handlePickSingleImageFile(setImage);
    setUploadingImage(false);
  };

  const handleVideoPick = async () => {
    setUploadingVideo(true);
    await handlePickSingleVideo(setVideo);
    setUploadingVideo(false);
  };

  const handleSubmit = async () => {
    if (!company.trim() || !caption.trim()) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    if (!image && !video) {
      Alert.alert(
        "Validation Error",
        "Please upload at least an image or video"
      );
      return;
    }

    try {
      console.log("=== PREPARING UPLOAD ===");

      const formData = new FormData();
      formData.append("company", company.trim());
      formData.append("caption", caption.trim());
      formData.append("expiryDate", expiryDate.toISOString());

      if (image) {
        console.log("Adding image:", {
          uri: image.uri,
          type: image.type,
          name: image.name,
          size: image.size,
        });

        formData.append("image", {
          uri: image.uri,
          type: image.type,
          name: image.name,
        });
      }

      if (video) {
        console.log("Adding video:", {
          uri: video.uri,
          type: video.type,
          name: video.name,
          size: video.size,
        });

        formData.append("video", {
          uri: video.uri,
          type: video.type,
          name: video.name,
        });
      }

      console.log("Dispatching createAd action...");

      await dispatch(createAd(formData)).unwrap();

      // Success is handled in useEffect
      console.log("Ad created successfully!");
    } catch (error) {
      console.error("=== SUBMIT ERROR ===");
      console.error("Error:", error);
      // Error is handled in useEffect, but log it here too
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Ad</Text>
        </View>

        {/* Company Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Company Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter company name"
            value={company}
            onChangeText={setCompany}
            placeholderTextColor="#999"
          />
        </View>

        {/* Caption */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Caption <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter ad caption"
            value={caption}
            onChangeText={setCaption}
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Expiry Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Expiry Date <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.dateText}>
              {expiryDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={expiryDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Image Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ad Image</Text>
          {uploadingImage ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Processing image...</Text>
            </View>
          ) : image ? (
            <View style={styles.mediaPreview}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveSingleImage(setImage)}
              >
                <Ionicons name="close-circle" size={28} color="#FF3B30" />
              </TouchableOpacity>
              <View style={styles.imageInfo}>
                <Text style={styles.imageName} numberOfLines={1}>
                  {image.name}
                </Text>
                <Text style={styles.imageSize}>
                  {formatFileSize(image.size)}
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleImagePick}
            >
              <Ionicons name="image-outline" size={32} color="#007AFF" />
              <Text style={styles.uploadText}>Upload Image</Text>
              <Text style={styles.uploadSubtext}>
                Recommended: 16:9 aspect ratio
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Video Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ad Video</Text>
          {uploadingVideo ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Processing video...</Text>
              <Text style={styles.loadingSubtext}>
                This may take a moment for large files
              </Text>
            </View>
          ) : video ? (
            <View style={styles.mediaPreview}>
              <View style={styles.videoPreview}>
                <Ionicons name="videocam" size={48} color="#007AFF" />
                <Text style={styles.videoName} numberOfLines={1}>
                  {video.name}
                </Text>
                <Text style={styles.videoSize}>
                  {formatFileSize(video.size)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveSingleVideo(setVideo)}
              >
                <Ionicons name="close-circle" size={28} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleVideoPick}
            >
              <Ionicons name="videocam-outline" size={32} color="#007AFF" />
              <Text style={styles.uploadText}>Upload Video</Text>
              <Text style={styles.uploadSubtext}>Max size: 50MB</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            Maximum 10 active ads allowed. The ad will automatically deactivate
            after the expiry date.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Create Ad</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateAdScreen;
