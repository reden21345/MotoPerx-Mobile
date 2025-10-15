import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const communitySelection = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  overlayTouchable: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.75,
  },
  safeArea: {
    flex: 1,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E1E8ED",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
    position: "relative",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#14171A",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F8FA",
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: "#14171A",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  communityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E1E8ED",
  },
  selectedItem: {
    backgroundColor: "#E8F5FE",
    borderColor: "#1DA1F2",
  },
  communityInfo: {
    flex: 1,
    marginRight: 12,
  },
  communityName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#14171A",
    marginBottom: 4,
  },
  communityDescription: {
    fontSize: 14,
    color: "#657786",
    marginBottom: 4,
  },
  communityMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 13,
    color: "#657786",
  },
  metaDivider: {
    marginHorizontal: 6,
    color: "#657786",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
    color: "#657786",
    textAlign: "center",
  },
});