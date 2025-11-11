import React, { useState } from 'react';
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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { 
  handlePickSingleImage, 
  handleRemoveSingleImage,
  handlePickSingleVideo, 
  handleRemoveSingleVideo,
  formatFileSize 
} from '../../utils/helpers';
import { createAds as styles} from '../../styles/CreateAds';

const CreateAds = ({ navigation }) => {
  const [company, setCompany] = useState('');
  const [caption, setCaption] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!company.trim() || !caption.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    if (!image && !video) {
      Alert.alert('Validation Error', 'Please upload at least an image or video');
      return;
    }

    setLoading(true);

    try {
      const formData = {
        company: company.trim(),
        caption: caption.trim(),
        expiryDate: expiryDate.toISOString(),
      };

      if (image) {
        formData.image = image;
      }

      if (video) {
        formData.video = video.base64;
      }

      // TODO: Replace with your actual API call
      // const response = await createAdAPI(formData);
      
      console.log('Form Data:', {
        ...formData,
        image: image ? 'Image included' : 'No image',
        video: video ? `Video: ${video.name}` : 'No video'
      });

      Alert.alert('Success', 'Ad created successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create ad');
    } finally {
      setLoading(false);
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
              {expiryDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
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
          {image ? (
            <View style={styles.mediaPreview}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveSingleImage(setImage)}
              >
                <Ionicons name="close-circle" size={28} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={() => handlePickSingleImage(setImage)}
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
          <Text style={styles.label}>Ad Video (Optional)</Text>
          {video ? (
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
              onPress={() => handlePickSingleVideo(setVideo)}
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

export default CreateAds;