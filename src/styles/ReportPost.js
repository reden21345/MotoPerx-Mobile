import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const reportModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#14171a",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#657786",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#657786",
    paddingHorizontal: 20,
    paddingVertical: 12,
    lineHeight: 20,
  },
  scrollView: {
    maxHeight: height * 0.5,
    paddingHorizontal: 20,
  },
  reasonButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  reasonButtonSelected: {
    backgroundColor: "#e7f5fe",
    borderColor: "#1DA1F2",
  },
  reasonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  reasonText: {
    flex: 1,
    fontSize: 16,
    color: "#14171a",
    fontWeight: "500",
  },
  reasonTextSelected: {
    color: "#1DA1F2",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 20,
    color: "#1DA1F2",
    fontWeight: "bold",
  },
  customReasonContainer: {
    marginTop: 12,
    marginBottom: 16,
  },
  customReasonLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#14171a",
    marginBottom: 8,
  },
  customReasonInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e1e8ed",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#14171a",
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: "#657786",
    textAlign: "right",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e1e8ed",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#657786",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: "#1DA1F2",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#b8d4e8",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});