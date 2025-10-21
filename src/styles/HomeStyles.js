import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  bodyContainer: {
    paddingBottom: 20,
  },

  bannerScrollContainer: {
    marginTop: -20,
  },
  bannerItem: {
    width: width * 0.9,
    height: width * 0.45,
    marginHorizontal: 10,
    overflow: "hidden",
    backgroundColor: "#98DB52", // green
    position: "relative",
  },
  rewardsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    flexDirection: "row",
    padding: 10,
    marginHorizontal: 8,
    marginTop: -6,
    justifyContent: "space-between",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  rewardsLeft: {
    flex: 1,
  },
  rewardsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  rewardsPoints: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  rewardsExpiry: {
    fontSize: 10,
    color: "#000000",
    marginTop: 2,
  },
  rewardsRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  viewHistoryButton: {
    backgroundColor: "#98DB52",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  viewHistoryText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 10,
  },
  redeemContainer: {
    alignItems: "center",
  },
  redeemLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#000000",
    marginTop: 2,
  },

  productContainer: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productBox: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: "center",
    padding: 20,
    borderColor: "#000",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  productValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  productLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },

  storeContainer: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  storeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  viewAllText: {
    fontSize: 14,
    color: "#000", // green for links
  },
  storeIconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  storeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  storeImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10, // <-- spacing between image and text
    justifyContent: "center",
    alignItems: "center",
  },

  storeLabel: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },

  blogContainer: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  blogList: {},
  postContainer: {
    marginRight: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DBE2E9",
    width: width * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  postImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  postTitle: {
    padding: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },

  carouselWrapper: {
    width: width,
    height: width * 0.5,
    marginBottom: 20,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  horizontalStoreRow: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },

  // GAME SECTION STYLES
  gamesSection: {
    marginHorizontal: 15,
    marginVertical: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gamesGradient: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: "#98DB52",
  },
  gamesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  gamesHeaderText: {
    marginLeft: 15,
    flex: 1,
  },
  gamesTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    letterSpacing: 1,
  },
  gamesSubtitle: {
    fontSize: 14,
    color: "#FFF",
    opacity: 0.9,
    marginTop: 4,
  },
  gamesIconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    paddingVertical: 15,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 15,
  },
  gameIconItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  playGamesButton: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  playGamesButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#98DB52",
    marginRight: 10,
    letterSpacing: 1,
  },
  gamesFeaturesList: {
    gap: 12,
  },
  gamesFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 10,
  },
  gamesFeatureText: {
    fontSize: 14,
    color: "#FFF",
    marginLeft: 10,
    fontWeight: "600",
  },
});
