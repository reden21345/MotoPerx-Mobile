import { StyleSheet } from "react-native";

export const communityDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#ffffff",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backButtonText: {
    fontSize: 24,
    color: "#000000",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  moreButton: {
    padding: 8,
    marginRight: -8,
  },
  moreButtonText: {
    fontSize: 20,
    color: "#666666",
    fontWeight: "bold",
  },

  // Cover Section
  coverSection: {
    height: 180,
    backgroundColor: "#98DB52",
  },
  coverGradient: {
    height: "100%",
    backgroundColor: "#98DB52",
    justifyContent: "center",
    alignItems: "center",
  },
  communityIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  communityIcon: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#98DB52",
  },
  communityAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },

  // Info Section
  infoSection: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  communityName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
    textAlign: "center",
  },
  communityDescription: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  pendingContainer: {
    backgroundColor: "#fff3cd",
    borderWidth: 1,
    borderColor: "#ffc107",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  pendingIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  pendingText: {
    fontSize: 15,
    color: "#856404",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 20,
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#98DB52",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#666666",
  },
  statBadge: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#e0e0e0",
  },

  // Creator Info
  creatorInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  creatorLabel: {
    fontSize: 14,
    color: "#666666",
  },
  creatorName: {
    fontSize: 14,
    color: "#98DB52",
    fontWeight: "600",
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#98DB52",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#98DB52",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#98DB52",
    fontSize: 15,
    fontWeight: "600",
  },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#98DB52",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666666",
  },
  activeTabText: {
    color: "#98DB52",
  },

  // Tab Content
  tabContent: {
    paddingTop: 8,
  },

  // Post Card
  postCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  postHeaderInfo: {
    marginLeft: 12,
    flex: 1,
  },
  postAuthor: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  postTime: {
    fontSize: 13,
    color: "#666666",
  },
  postMenuButton: {
    padding: 4,
  },
  postMenuIcon: {
    fontSize: 20,
    color: "#666666",
    fontWeight: "bold",
  },
  postTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
    lineHeight: 22,
  },
  postContent: {
    fontSize: 15,
    color: "#000000",
    lineHeight: 20,
    marginBottom: 12,
  },
  imageScrollContainer: {
    marginBottom: 12,
  },
  postImage: {
    width: 320,
    height: 250,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
  },
  postImageMultiple: {
    width: 280,
  },
  linkPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
  },
  linkIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: "#98DB52",
    fontWeight: "500",
  },
  postStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  postStatsText: {
    fontSize: 13,
    color: "#666666",
    marginRight: 16,
  },
  postActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  actionText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  actionTextActive: {
    color: "#98DB52",
    fontWeight: "600",
  },

  // Member Card
  memberCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
  },
  memberInfo: {
    marginLeft: 12,
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 13,
    color: "#98DB52",
    fontWeight: "500",
    marginBottom: 2,
  },
  memberJoinDate: {
    fontSize: 12,
    color: "#666666",
  },
  removeButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  removeButtonText: {
    color: "#98DB52",
    fontSize: 14,
    fontWeight: "600",
  },

  // About Section
  aboutContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  aboutItem: {
    marginBottom: 20,
  },
  aboutLabel: {
    fontSize: 13,
    color: "#666666",
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  aboutValue: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },
  aboutDescription: {
    fontSize: 15,
    color: "#000000",
    lineHeight: 22,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },

  // Restricted State (for private communities)
  restrictedState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  restrictedIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  restrictedTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  restrictedText: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  joinButton: {
    backgroundColor: "#98DB52",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#98DB52",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  joinButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },

  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#98DB52",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
