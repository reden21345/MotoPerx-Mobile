import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { updateCommunity } from "../../redux/actions/communityAction";
import { pickAvatar } from "../../utils/helpers";
import { editCommunityStyles as styles } from "../../styles/EditCommunity";

const EditCommunityModal = ({ visible, community, onClose }) => {
  const dispatch = useDispatch();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (community) {
      setName(community.name || "");
      setDescription(community.description || "");
      setIsPrivate(community.isPrivate || false);
      setAvatar(community.avatar || null);
    }
  }, [community]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Community name is required");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Community description is required");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        _id: community._id,
        name: name.trim(),
        description: description.trim(),
        isPrivate,
      };

      if (avatar && avatar !== community.avatar) {
        updateData.avatar = avatar;
      }

      await dispatch(updateCommunity(updateData)).unwrap();
      Alert.alert("Success", "Community updated successfully");
      onClose();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update community");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setName(community.name || "");
    setDescription(community.description || "");
    setIsPrivate(community.isPrivate || false);
    setAvatar(community.avatar || null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Community</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <Text style={styles.label}>Community Avatar</Text>
              <TouchableOpacity
                style={styles.avatarButton}
                onPress={() => pickAvatar(setAvatar)}
              >
                {avatar ? (
                  <Image source={{ uri: avatar.url ? avatar.url : avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarPlaceholderText}>
                      {name.charAt(0).toUpperCase() || "C"}
                    </Text>
                  </View>
                )}
                <Text style={styles.changeAvatarText}>Change Avatar</Text>
              </TouchableOpacity>
            </View>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Community Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter community name"
                maxLength={50}
              />
              <Text style={styles.charCount}>{name.length}/50</Text>
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter community description"
                multiline
                numberOfLines={4}
                maxLength={200}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{description.length}/200</Text>
            </View>

            {/* Privacy Toggle */}
            <View style={styles.privacySection}>
              <View style={styles.privacyInfo}>
                <Text style={styles.label}>Private Community</Text>
                <Text style={styles.privacyDescription}>
                  {isPrivate
                    ? "Only approved members can view posts"
                    : "Anyone can view posts"}
                </Text>
              </View>
              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                trackColor={{ false: "#d1d5db", true: "#60a5fa" }}
                thumbColor={isPrivate ? "#1a73e8" : "#f4f4f5"}
              />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default EditCommunityModal;