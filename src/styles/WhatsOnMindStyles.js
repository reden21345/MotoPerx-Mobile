import { StyleSheet } from "react-native";

export const whatsOnMindStyles = StyleSheet.create({
  // Create Post Section Styles
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
    backgroundColor: "#1DA1F2",
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
});