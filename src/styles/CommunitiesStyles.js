import { StyleSheet } from "react-native";

export const communitiesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  
  // Search Bar Styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
  },
  createButton: {
    width: 44,
    height: 44,
    backgroundColor: "#98DB52",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#98DB52",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 28,
  },

  // Filter Styles
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: "#98DB52",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },

  // Card Styles
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardCreator: {
    borderColor: "#FFD700",
    backgroundColor: "#FFFEF5",
  },
  cardJoined: {
    borderColor: "#34C759",
    backgroundColor: "#F5FFF8",
  },

  cardHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#98DB52",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  communityName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    flex: 1,
  },
  privateBadge: {
    backgroundColor: "#FFE5B4",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  privateBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8B6914",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },

  // Stats Container
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#98DB52",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E5E5",
  },
  creatorLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  // Status Section Styles
  statusSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  statusBadgeCreator: {
    backgroundColor: "#FFF4E5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  statusTextCreator: {
    fontSize: 14,
    fontWeight: "700",
    color: "#B8860B",
  },
  statusBadgeJoined: {
    backgroundColor: "#E8F5E9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#34C759",
  },
  statusTextJoined: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E7D32",
  },
  joinButton: {
    backgroundColor: "#98DB52",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#98DB52",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  joinButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});