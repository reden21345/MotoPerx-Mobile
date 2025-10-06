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
import {
  handlePickSingleImage,
  handleRemoveSingleImage,
} from "../../utils/helpers";
import { addComment } from "../../redux/actions/commentAction";
import { postItemStyles as styles2 } from "../../styles/PostItemStyles";

const CreateComment = ({ visible, onClose, postId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const closeModal = () => {
    setText("");
    setImage(null);
    onClose();
  };

  const handleCreateComment = () => {
    if (!text.trim() && !image) {
      Alert.alert("Error", "Please add a text or image to your comment.");
      return;
    }

    dispatch(addComment({ postId, text, image })).then(() => {
      Alert.alert("Success", "Comment added successfully");
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
            <TouchableOpacity onPress={handleCreateComment}>
              <Text style={styles.modalPostText}>Comment</Text>
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
                  <Text style={styles2.avatarText}>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </Text>
                )}
              </View>
              <Text style={styles.modalUsername}>
                {user?.name || "Anonymous"}
              </Text>
            </View>

            {/* Title Input */}
            <TextInput
              style={styles.modalTitleInput}
              placeholder="Add a comment"
              placeholderTextColor="#657786"
              value={text}
              onChangeText={setText}
              multiline={false}
            />

            {/* Image Selection */}
            <TouchableOpacity
              style={styles.imageSelectionButton}
              onPress={() => handlePickSingleImage(setImage)}
            >
              <Text style={styles.imageIcon}>📷</Text>
              <Text style={styles.imageSelectionText}>Add Photo</Text>
            </TouchableOpacity>

            {image && (
              <View style={styles.imageContainer}>
                <Text style={styles.imageText}>Selected image:</Text>
                <View style={styles.previewRow}>
                  <View style={styles.previewBox}>
                    <Image
                      source={{ uri: image }}
                      style={styles.previewImage}
                    />
                    <TouchableOpacity
                      style={styles.removeIcon}
                      onPress={() => handleRemoveSingleImage(setImage)}
                    >
                      <Ionicons name="close-circle" size={18} color="#f00" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CreateComment;
