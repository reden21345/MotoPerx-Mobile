import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { createPostStyles } from "../../styles/CreatePostStyles";

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

  const handleImageSelection = () => {
    // This function will be called when user taps the image icon
    // You'll implement the image picker functionality here
    Alert.alert("Image Selection", "Image picker functionality will be implemented here");
  };

  const handleCreatePost = () => {
    if (!postTitle.trim() && !postDescription.trim()) {
      Alert.alert("Error", "Please add a title or description");
      return;
    }

    // Here you'll dispatch the create post action
    Alert.alert("Success", "Post creation functionality will be implemented here");
    closeModal();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={createPostStyles.modalOverlay}>
        <View style={createPostStyles.modalContainer}>
          {/* Modal Header */}
          <View style={createPostStyles.modalHeader}>
            <TouchableOpacity onPress={closeModal}>
              <Text style={createPostStyles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={createPostStyles.modalTitle}>Create Post</Text>
            <TouchableOpacity onPress={handleCreatePost}>
              <Text style={createPostStyles.modalPostText}>Post</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={createPostStyles.modalContent}>
            {/* User Info */}
            <View style={createPostStyles.modalUserInfo}>
              <View style={createPostStyles.modalAvatar}>
                <Text style={createPostStyles.modalAvatarText}>
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <Text style={createPostStyles.modalUsername}>
                {user?.username || 'Anonymous'}
              </Text>
            </View>

            {/* Title Input */}
            <TextInput
              style={createPostStyles.modalTitleInput}
              placeholder="Add a title (optional)"
              placeholderTextColor="#657786"
              value={postTitle}
              onChangeText={setPostTitle}
              multiline={false}
            />

            {/* Description Input */}
            <TextInput
              style={createPostStyles.modalDescriptionInput}
              placeholder="What's happening?"
              placeholderTextColor="#657786"
              value={postDescription}
              onChangeText={setPostDescription}
              multiline={true}
              textAlignVertical="top"
            />

            {/* Image Selection */}
            <TouchableOpacity 
              style={createPostStyles.imageSelectionButton}
              onPress={handleImageSelection}
            >
              <Text style={createPostStyles.imageIcon}>📷</Text>
              <Text style={createPostStyles.imageSelectionText}>Add Photos</Text>
            </TouchableOpacity>

            {/* Selected Images Preview (placeholder) */}
            {selectedImages.length > 0 && (
              <View style={createPostStyles.selectedImagesContainer}>
                <Text style={createPostStyles.selectedImagesText}>
                  {selectedImages.length} image(s) selected
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CreatePost;