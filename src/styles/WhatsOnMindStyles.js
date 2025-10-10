import { StyleSheet } from "react-native";

export const whatsOnMindStyles = StyleSheet.create({
  createPostSection: {
    backgroundColor: "#ffffff",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  createPostContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  createPostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#98DB52",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  createPostAvatarText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  createPostInput: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e1e8ed",
  },
  createPostPlaceholder: {
    color: "#657786",
    fontSize: 16,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  communityButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#98DB52",
    gap: 6,
  },
  communityButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 6,
  },
});