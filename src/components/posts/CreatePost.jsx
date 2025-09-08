import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { createPostStyles as styles } from "../../styles/CreatePostStyles";
import {
  handlePickImages,
  formatDate,
  handleRemoveImage,
} from "../../utils/helpers";

const CreatePost = ({ visible, onClose }) => {
  const { user } = useSelector((state) => state.auth);

  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  const closeModal = () => {
    setPostTitle("");
    setPostDescription("");
    setSelectedImages([]);
    onClose();
  };

  const handleCreatePost = () => {
    if (!postTitle.trim() && !postDescription.trim()) {
      Alert.alert("Error", "Please add a title or description");
      return;
    }

    // Here you'll dispatch the create post action
    Alert.alert(
      "Success",
      "Post creation functionality will be implemented here"
    );
    closeModal();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Post</Text>
            <TouchableOpacity onPress={handleCreatePost}>
              <Text style={styles.modalPostText}>Post</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* User Info */}
            <View style={styles.modalUserInfo}>
              <View style={styles.modalAvatar}>
                <Text style={styles.modalAvatarText}>
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
              <Text style={styles.modalUsername}>
                {user?.username || "Anonymous"}
              </Text>
            </View>

            {/* Title Input */}
            <TextInput
              style={styles.modalTitleInput}
              placeholder="Add a title (optional)"
              placeholderTextColor="#657786"
              value={postTitle}
              onChangeText={setPostTitle}
              multiline={false}
            />

            {/* Description Input */}
            <TextInput
              style={styles.modalDescriptionInput}
              placeholder="What's happening?"
              placeholderTextColor="#657786"
              value={postDescription}
              onChangeText={setPostDescription}
              multiline={true}
              textAlignVertical="top"
            />

            {/* Image Selection */}
            <TouchableOpacity
              style={styles.imageSelectionButton}
              onPress={() => handlePickImages(setSelectedImages)}
            >
              <Text style={styles.imageIcon}>📷</Text>
              <Text style={styles.imageSelectionText}>Add Photos</Text>
            </TouchableOpacity>

            {selectedImages.length > 0 && (
              <View style={styles.selectedImagesContainer}>
                <Text style={styles.selectedImagesText}>
                  {selectedImages.length} image(s) selected:
                </Text>
                <View style={styles.previewRow}>
                  {selectedImages.map((uri, index) => (
                    <View key={index} style={styles.previewBox}>
                      <Image source={{ uri }} style={styles.previewImage} />
                      <TouchableOpacity
                        style={styles.removeIcon}
                        onPress={() => handleRemoveImage(index, setSelectedImages)}
                      >
                        <Ionicons name="close-circle" size={18} color="#f00" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CreatePost;
