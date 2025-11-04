import React, { useState, useEffect } from "react";
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
import { handlePickImages, handleRemoveImage } from "../../utils/helpers";
import { updatePost } from "../../redux/actions/postAction";

const EditPost = ({ visible, onClose, item }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    if (item) {
      setPostTitle(item.title || "");
      setPostDescription(item.caption || "");
      setSelectedImages(item.images || []);
    }
  }, [item]);

  const closeModal = () => {
    setPostTitle("");
    setPostDescription("");
    setSelectedImages([]);
    onClose();
  };

  const handleEditPost = () => {
    if (!postTitle.trim() && !postDescription.trim()) {
      Alert.alert("Error", "Please add a title and description");
      return;
    }

    const data = {
      ...item,
      title: postTitle,
      caption: postDescription,
      images: selectedImages,
    };

    dispatch(updatePost(data)).then(() => {
      Alert.alert("Success", "Post updated successfully");
      closeModal();
    });
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
            <Text style={styles.modalTitle}>Edit Post</Text>
            <TouchableOpacity onPress={handleEditPost}>
              <Text style={styles.modalPostText}>Confirm</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* User Info */}
            <View style={styles.modalUserInfo}>
              <View style={styles.modalAvatar}>
                {item?.createdBy?.avatar?.url ? (
                  <Image
                    source={{ uri: item?.createdBy?.avatar?.url }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.modalAvatarText}>
                    {item?.createdBy?.name?.charAt(0).toUpperCase() || "U"}
                  </Text>
                )}
                {/* <Text style={styles.modalAvatarText}>
                  {item?.createdBy?.name?.charAt(0).toUpperCase() || "U"}
                </Text> */}
              </View>
              <Text style={styles.modalUsername}>
                {user?.name || "Anonymous"}
              </Text>
            </View>

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
                  {selectedImages.map((image, index) => (
                    <View key={index} style={styles.previewBox}>
                      <Image
                        source={{ uri: image?.url ? image.url : image }}
                        style={styles.previewImage}
                      />
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
  );
};

export default EditPost;
