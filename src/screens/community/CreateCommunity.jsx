import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createCommunity } from '../../redux/actions/communityAction';
import { pickAvatar } from '../../utils/helpers';
import { createCommunity as styles } from '../../styles/CreateCommunity';

const CreateCommunity = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.communities);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatar: null,
    isPrivate: false,
  });

  const handleImagePick = async () => {
    await pickAvatar((base64Image) => {
      setFormData({ ...formData, avatar: base64Image });
    });
  };

  const handleCreateCommunity = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Community name is required');
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert('Validation Error', 'Description is required');
      return;
    }

    if (formData.name.length < 3) {
      Alert.alert('Validation Error', 'Community name must be at least 3 characters');
      return;
    }

    try {
      const result = await dispatch(createCommunity(formData)).unwrap();
      
      Alert.alert(
        'Success',
        'Community created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error || 'Failed to create community');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Community</Text>
        <Text style={styles.subtitle}>Build your own community space</Text>
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <Text style={styles.label}>Community Avatar</Text>
        <TouchableOpacity style={styles.avatarContainer} onPress={handleImagePick}>
          {formData.avatar ? (
            <Image source={{ uri: formData.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>+</Text>
              <Text style={styles.avatarPlaceholderSubtext}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
        {formData.avatar && (
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={handleImagePick}
          >
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Community Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter community name"
          placeholderTextColor="#999"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          maxLength={30}
        />
        <Text style={styles.charCount}>{formData.name.length}/30</Text>
      </View>

      {/* Description Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your community..."
          placeholderTextColor="#999"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={100}
        />
        <Text style={styles.charCount}>{formData.description.length}/100</Text>
      </View>

      {/* Private Toggle */}
      <View style={styles.switchContainer}>
        <View style={styles.switchTextContainer}>
          <Text style={styles.switchLabel}>Private Community</Text>
          <Text style={styles.switchDescription}>
            Members must be approved to join
          </Text>
        </View>
        <Switch
          value={formData.isPrivate}
          onValueChange={(value) => setFormData({ ...formData, isPrivate: value })}
          trackColor={{ false: '#d1d5db', true: '#86efac' }}
          thumbColor={formData.isPrivate ? '#22c55e' : '#f4f4f5'}
        />
      </View>

      {/* Create Button */}
      <TouchableOpacity
        style={[styles.createButton, loading && styles.createButtonDisabled]}
        onPress={handleCreateCommunity}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.createButtonText}>Create Community</Text>
        )}
      </TouchableOpacity>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📋 Guidelines</Text>
        <Text style={styles.infoText}>
          • Choose a clear and descriptive name{'\n'}
          • Write a detailed description{'\n'}
          • Add an avatar to make it recognizable{'\n'}
          • Set privacy based on your needs
        </Text>
      </View>
    </ScrollView>
  );
};

export default CreateCommunity;