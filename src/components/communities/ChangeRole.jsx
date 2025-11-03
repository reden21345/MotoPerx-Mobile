import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changeMemberRole } from "../../redux/actions/communityAction";
import { addMemberStyles as styles } from "../../styles/AddMember";

const ChangeRole = ({ visible, onClose, communityId, member }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.communities);
  
  const [role, setRole] = useState(member?.role || "Member");

  // Reset role when member changes
  useEffect(() => {
    if (member) {
      setRole(member.role);
    }
  }, [member]);

  const handleClose = () => {
    setRole(member?.role || "Member");
    onClose();
  };

  const handleChangeMemberRole = async () => {
    if (!member) return;

    const data = {
      communityId,
      userId: member.user._id,
      newRole: role,
    };

    await dispatch(changeMemberRole(data));
    handleClose();
  };

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
  };

  if (!member) return null;

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
              <Text style={styles.title}>Change Member Role</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Member Info */}
            <View style={styles.memberInfoContainer}>
              <Image
                source={{ uri: member.user.avatar.url }}
                style={styles.memberAvatar}
              />
              <View style={styles.memberDetails}>
                <Text style={styles.memberName}>{member.user.name}</Text>
                <Text style={styles.currentRole}>Current Role: {member.role}</Text>
              </View>
            </View>

            {/* Role Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select New Role</Text>
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
                  ]}
                  onPress={() => selectRole("Moderator")}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === "Moderator" && styles.roleButtonTextActive,
                    ]}
                  >
                    Moderator
                  </Text>
                </TouchableOpacity>
              </View>
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
                style={[
                  styles.addButton,
                  (loading || role === member.role) && styles.addButtonDisabled,
                ]}
                onPress={handleChangeMemberRole}
                disabled={loading || role === member.role}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.addButtonText}>Update Role</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChangeRole;