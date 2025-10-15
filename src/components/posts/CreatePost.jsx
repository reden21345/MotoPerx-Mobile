import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { createPostStyles as styles } from "../../styles/CreatePostStyles";
import { postItemStyles as styles2 } from "../../styles/PostItemStyles";
import { handlePickImages, handleRemoveImage } from "../../utils/helpers";
import { createPosts } from "../../redux/actions/postAction";
import CommunitySelection from "./CommunitySelection";

const CreatePost = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { communities, joinedCommunities, createdCommunities } = useSelector(
    (state) => state.communities
  );

  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showCommunityModal, setShowCommunityModal] = useState(false);

  const closeModal = () => {
    setPostTitle("");
    setPostDescription("");
    setSelectedImages([]);
    setSelectedCommunity(null);
    onClose();
  };

  const handleCreatePost = () => {
    if (!postTitle.trim() && !postDescription.trim()) {
      Alert.alert("Error", "Please add a title and description");
      return;
    }

    if (user.role === "user" && !selectedCommunity) {
      Alert.alert("Required", "Please select a community");
      return;
    }

    if (postTitle.length > 100) {
      Alert.alert("Error", "Title cannot exceed 100 characters");
      return;
    }

    const data = {
      title: postTitle,
      caption: postDescription,
      images: selectedImages,
      postType: selectedCommunity ? "community" : "admin",
    };

    if (selectedCommunity) {
      data.community = selectedCommunity._id;
    }

    dispatch(createPosts(data)).then(() => {
      Alert.alert("Success", "Post created successfully");
      closeModal();
    });
  };

  return (
    <>
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
                  {user?.avatar?.url ? (
                    <Image
                      source={{
                        uri: user?.avatar?.url,
                      }}
                      style={styles2.avatarImage}
                    />
                  ) : (
                    <Text style={styles.modalAvatarText}>
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </Text>
                  )}
                </View>
                <Text style={styles.modalUsername}>
                  {user?.name || "Anonymous"}
                </Text>
              </View>

              {/* Community Selection */}
              <TouchableOpacity
                style={styles.communitySelector}
                onPress={() => setShowCommunityModal(true)}
              >
                <View style={styles.communitySelectorContent}>
                  <Ionicons name="people" size={20} color="#1DA1F2" />
                  <Text style={styles.communitySelectorText}>
                    {selectedCommunity
                      ? selectedCommunity.name
                      : "Select a community"}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#657786" />
              </TouchableOpacity>

              {/* Title Input */}
              <TextInput
                style={styles.modalTitleInput}
                placeholder="Add a title"
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
                          onPress={() =>
                            handleRemoveImage(index, setSelectedImages)
                          }
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

      {/* Community Selection Modal */}
      <CommunitySelection
        visible={showCommunityModal}
        onClose={() => setShowCommunityModal(false)}
        communities={communities}
        joinedCommunities={joinedCommunities}
        createdCommunities={createdCommunities}
        selectedCommunity={selectedCommunity}
        onSelectCommunity={setSelectedCommunity}
      />
    </>
  );
};

export default CreatePost;