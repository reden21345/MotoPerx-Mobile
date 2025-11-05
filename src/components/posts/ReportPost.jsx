import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useDispatch } from "react-redux";
import { reportPost } from "../../redux/actions/postAction";
import { reportModalStyles as styles } from "../../styles/ReportPost";

const ReportPostModal = ({ visible, onClose, postId }) => {
  const dispatch = useDispatch();
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    { id: "spam", label: "Spam", icon: "📢" },
    { id: "harassment", label: "Harassment or Bullying", icon: "🚫" },
    { id: "hate_speech", label: "Hate Speech", icon: "⚠️" },
    { id: "violence", label: "Violence or Threats", icon: "🔪" },
    { id: "nudity", label: "Nudity or Sexual Content", icon: "🔞" },
    { id: "misinformation", label: "False Information", icon: "❌" },
    { id: "scam", label: "Scam or Fraud", icon: "💰" },
    { id: "other", label: "Other", icon: "📝" },
  ];

  const handleReasonSelect = (reasonId) => {
    setSelectedReason(reasonId);
    if (reasonId !== "other") {
      setCustomReason("");
    }
  };

  const handleSubmit = () => {
    if (!selectedReason) {
      alert("Please select a reason for reporting");
      return;
    }

    if (selectedReason === "other" && !customReason.trim()) {
      alert("Please describe the reason for reporting");
      return;
    }

    setIsSubmitting(true);

    const reportText =
      selectedReason === "other"
        ? customReason.trim()
        : reportReasons.find((r) => r.id === selectedReason)?.label;

    dispatch(reportPost({ postId, text: reportText }));
    handleClose();
  };

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Report Post</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                  Help us understand what's wrong with this post
                </Text>

                {/* Report Reasons */}
                <ScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {reportReasons.map((reason) => (
                    <TouchableOpacity
                      key={reason.id}
                      style={[
                        styles.reasonButton,
                        selectedReason === reason.id &&
                          styles.reasonButtonSelected,
                      ]}
                      onPress={() => handleReasonSelect(reason.id)}
                    >
                      <Text style={styles.reasonIcon}>{reason.icon}</Text>
                      <Text
                        style={[
                          styles.reasonText,
                          selectedReason === reason.id &&
                            styles.reasonTextSelected,
                        ]}
                      >
                        {reason.label}
                      </Text>
                      {selectedReason === reason.id && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}

                  {/* Custom Reason Input */}
                  {selectedReason === "other" && (
                    <View style={styles.customReasonContainer}>
                      <Text style={styles.customReasonLabel}>
                        Please describe the issue:
                      </Text>
                      <TextInput
                        style={styles.customReasonInput}
                        placeholder="Explain why you're reporting this post..."
                        placeholderTextColor="#657786"
                        value={customReason}
                        onChangeText={setCustomReason}
                        multiline
                        numberOfLines={4}
                        maxLength={500}
                        textAlignVertical="top"
                      />
                      <Text style={styles.characterCount}>
                        {customReason.length}/500
                      </Text>
                    </View>
                  )}
                </ScrollView>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      (!selectedReason || isSubmitting) &&
                        styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!selectedReason || isSubmitting}
                  >
                    <Text style={styles.submitButtonText}>
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReportPostModal;
