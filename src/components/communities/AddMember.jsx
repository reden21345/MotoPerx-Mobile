import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addMember } from "../../redux/actions/communityAction";
import { addMemberStyles as styles } from "../../styles/AddMember";

const AddMemberModal = ({ visible, onClose, communityId, isOwner }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.communities);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [emailError, setEmailError] = useState("");

  // Determine if user can add moderators
  const canAddModerator = isOwner;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddMember = async () => {
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    const data = {
      communityId,
      email: email.trim(),
      role,
    };

    await dispatch(
      addMember(data)
    );
  };

  const handleClose = () => {
    setEmail("");
    setRole("Member");
    setEmailError("");
    onClose();
  };

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Add Member</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="Enter member's email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            {/* Role Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Role</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === "Member" && styles.roleButtonActive,
                  ]}
                  onPress={() => selectRole("Member")}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === "Member" && styles.roleButtonTextActive,
                    ]}
                  >
                    Member
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === "Moderator" && styles.roleButtonActive,
                    !canAddModerator && styles.roleButtonDisabled,
                  ]}
                  onPress={() => selectRole("Moderator")}
                  disabled={loading || !canAddModerator}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === "Moderator" && styles.roleButtonTextActive,
                      !canAddModerator && styles.roleButtonTextDisabled,
                    ]}
                  >
                    Moderator
                  </Text>
                </TouchableOpacity>
              </View>
              {!canAddModerator && (
                <Text style={styles.restrictionText}>
                  Only the community owner can add moderators
                </Text>
              )}
              <Text style={styles.roleDescription}>
                {role === "Member"
                  ? "Can view and interact with posts"
                  : "Can manage posts and members"}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addButton, loading && styles.addButtonDisabled]}
                onPress={handleAddMember}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.addButtonText}>Add Member</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddMemberModal;
