import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const quizGameStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F2937",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#111827",
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 16,
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
    textAlign: "center",
  },

  // Mode Selection
  modeContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 16,
  },
  modeCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  modeCardContent: {
    flexDirection: "row",
    padding: 20,
  },
  disabledCard: {
    opacity: 0.5,
  },
  modeIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 6,
  },
  modeDescription: {
    fontSize: 13,
    color: "#D1D5DB",
    marginBottom: 10,
    lineHeight: 18,
  },
  modeBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  modeBadgeText: {
    fontSize: 11,
    color: "#FFF",
    fontWeight: "600",
  },
  lockedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  lockedText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // Actions
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // How to Play
  howToPlayContainer: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  howToPlayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10B981",
    marginBottom: 16,
  },
  howToPlayItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  howToPlayText: {
    flex: 1,
    fontSize: 14,
    color: "#D1D5DB",
    lineHeight: 20,
  },

  // Quiz
  quizContainer: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  timerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10B981",
  },
  timerWarning: {
    color: "#EF4444",
  },
  questionContainer: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    lineHeight: 26,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  optionContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#FFF",
    lineHeight: 22,
  },

  // Result
  resultContainer: {
    padding: 20,
    alignItems: "center",
  },
  resultHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 16,
    marginBottom: 8,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#10B981",
  },
  resultStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
    gap: 12,
  },
  resultStatBox: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  resultStatValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  resultStatLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  competitiveInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  competitiveText: {
    flex: 1,
    fontSize: 14,
    color: "#D1D5DB",
    lineHeight: 20,
  },
  resultActions: {
    width: "100%",
    gap: 12,
  },
  resultButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  resultButtonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#10B981",
  },
  resultButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  resultButtonTextSecondary: {
    color: "#10B981",
  },

  // History
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  historyInfo: {
    flex: 1,
  },
  historyMode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyScore: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10B981",
    marginBottom: 2,
  },
  historyCorrect: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  // Leaderboard
  weekText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 20,
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  leaderboardRank: {
    width: 40,
    alignItems: "center",
  },
  rankText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9CA3AF",
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  leaderboardDetails: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  leaderboardScore: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10B981",
  },

  // Common
  noDataText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 14,
    fontStyle: "italic",
    paddingVertical: 40,
  },
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});