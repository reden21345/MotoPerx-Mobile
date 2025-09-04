import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export const createPostStyles = StyleSheet.create({
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    width: width * 0.95,
    maxHeight: "80%",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  modalCancelText: {
    fontSize: 16,
    color: "#657786",
    fontWeight: "500",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#14171a",
  },
  modalPostText: {
    fontSize: 16,
    color: "#1DA1F2",
    fontWeight: "600",
  },
  modalContent: {
    padding: 16,
  },
  modalUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1DA1F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  modalAvatarText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalUsername: {
    fontSize: 15,
    fontWeight: "600",
    color: "#14171a",
  },
  modalTitleInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
    paddingVertical: 12,
    fontSize: 16,
    color: "#14171a",
    marginBottom: 16,
  },
  modalDescriptionInput: {
    minHeight: 120,
    fontSize: 16,
    color: "#14171a",
    marginBottom: 20,
    textAlignVertical: "top",
  },
  imageSelectionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e1e8ed",
    marginBottom: 16,
  },
  imageIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  imageSelectionText: {
    fontSize: 16,
    color: "#1DA1F2",
    fontWeight: "500",
  },
  selectedImagesContainer: {
    backgroundColor: "#e8f5fd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  selectedImagesText: {
    fontSize: 14,
    color: "#1DA1F2",
    fontWeight: "500",
  },
});