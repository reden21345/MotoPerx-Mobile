import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const postDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e1e8ed",
    backgroundColor: "#ffffff",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backButtonText: {
    fontSize: 24,
    color: "#14171a",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#14171a",
  },
  moreButton: {
    padding: 8,
    marginRight: -8,
  },
  moreButtonText: {
    fontSize: 20,
    color: "#657786",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },

  // Error state styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e0245e",
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: "#657786",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: "#1DA1F2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },

  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#657786",
    fontWeight: "500",
  },

  userSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1DA1F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#14171a",
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 14,
    color: "#657786",
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#14171a",
    marginBottom: 12,
    lineHeight: 28,
  },
  postCaption: {
    fontSize: 16,
    color: "#14171a",
    lineHeight: 24,
  },
  imageSection: {
    marginBottom: 16,
    position: "relative",
  },
  imageSlide: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  postImage: {
    width: width,
    height: width * 0.8,
    backgroundColor: "#f0f0f0",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1d8da",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#1DA1F2",
    width: 20,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderTopColor: "#e1e8ed",
    borderBottomColor: "#e1e8ed",
    backgroundColor: "#fafafa",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 32,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#657786",
    fontWeight: "600",
  },
  likedIcon: {
    transform: [{ scale: 1.1 }],
  },
  likedText: {
    color: "#e91e63",
    fontWeight: "700",
  },
  commentsSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#14171a",
    marginBottom: 16,
  },
  commentContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1DA1F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  commentAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentAvatarText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  commentContent: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#14171a",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: "#14171a",
    lineHeight: 20,
  },
  commentImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  noCommentsText: {
    fontSize: 16,
    color: "#657786",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 20,
  },
  addCommentButton: {
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#e1e8ed",
  },
  addCommentText: {
    fontSize: 16,
    color: "#657786",
    fontStyle: "italic",
  },
});
