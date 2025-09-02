import { StyleSheet, Platform, StatusBar, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  postContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 0,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1DA1F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: "600",
    color: "#14171a",
    marginBottom: 2,
  },
  communityName: {
    fontSize: 13,
    color: "#657786",
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 13,
    color: "#657786",
  },
  moreButton: {
    padding: 8,
  },
  moreText: {
    fontSize: 18,
    color: "#657786",
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#14171a",
    marginBottom: 8,
    lineHeight: 22,
  },
  postCaption: {
    fontSize: 15,
    color: "#14171a",
    lineHeight: 20,
  },
  imageContainer: {
    marginBottom: 12,
  },
  singleImage: {
    width: width,
    height: width * 0.75, // 4:3 aspect ratio
    backgroundColor: "#f0f0f0",
  },
  imageList: {
    paddingLeft: 16,
  },
  multipleImage: {
    width: width * 0.7,
    height: width * 0.5,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  actionBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#e1e8ed",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 32,
    paddingVertical: 4,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  actionText: {
    fontSize: 13,
    color: "#657786",
    fontWeight: "500",
  },
  likedIcon: {
    transform: [{ scale: 1.1 }],
  },
  likedText: {
    color: "#e91e63",
    fontWeight: "600",
  },
});