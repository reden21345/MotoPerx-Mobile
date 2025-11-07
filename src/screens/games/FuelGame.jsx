import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fuelGameStyles as styles } from "../../styles/FuelGame";
import {
  getFuelChallenge,
  submitFuelChallenge,
  getUserFuelHistory,
  getFuelLeaderboard,
} from "../../redux/actions/gameAction";

const FuelGame = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    fuelChallenge,
    fuelResult,
    fuelHistory,
    fuelLeaderboard,
    userBestScore,
    weekStart,
    loading,
    pagination,
  } = useSelector((state) => state.games);

  const [gameState, setGameState] = useState("menu"); // menu, challenge, result, history, leaderboard
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [currentFuel, setCurrentFuel] = useState(100);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompetitive, setIsCompetitive] = useState(false);
  const [competitiveAttempts, setCompetitiveAttempts] = useState(0);

  const fuelAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadInitialData();
  }, [dispatch]);

  const loadInitialData = async () => {
    try {
      await dispatch(getUserFuelHistory({ page: 1, limit: 10 })).unwrap();
      await dispatch(getFuelLeaderboard({ limit: 10 })).unwrap();

      // Get competitive attempts count
      if (fuelHistory) {
        const weeklyCompetitive = fuelHistory.filter(
          (h) => h.isCompetitive && h.weekStart === weekStart
        );
        setCompetitiveAttempts(weeklyCompetitive.length);
      }
    } catch (error) {
      console.log("Error loading data:", error);
    }
  };

  useEffect(() => {
    if (gameState === "challenge" && fuelChallenge) {
      // Don't reset fuel here - it should persist across questions

      // Animate progress bar
      const scenario =
        fuelChallenge.challenge || fuelChallenge.scenario || fuelChallenge;
      const questionCount = scenario?.questions?.length || 1;
      Animated.timing(progressAnim, {
        toValue: (currentQuestionIndex + 1) / questionCount,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentQuestionIndex, gameState, fuelChallenge]);

  const startChallenge = async (competitive = false) => {
    if (competitive && competitiveAttempts >= 2) {
      Alert.alert(
        "Limit Reached",
        "You've used both competitive attempts this week. Try practice mode or wait for next week!",
        [{ text: "OK" }]
      );
      return;
    }

    setIsCompetitive(competitive);
    setGameState("challenge");
    setCurrentQuestionIndex(0);
    setDecisions([]);
    setSelectedChoice(null);
    setShowFeedback(false);

    try {
      const result = await dispatch(
        getFuelChallenge({ isCompetitive: competitive })
      ).unwrap();
      const scenario = result.challenge || result.scenario;
      if (scenario) {
        setCurrentFuel(scenario.initialFuel); 
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error || "Failed to load challenge. Please try again."
      );
      setGameState("menu");
    }
  };

  const handleChoiceSelect = (choice) => {
    // Prevent selecting if already selected
    if (selectedChoice) return;

    // Get the actual scenario object
    const scenario =
      fuelChallenge.challenge || fuelChallenge.scenario || fuelChallenge;
    const currentQuestion = scenario.questions[currentQuestionIndex];

    const newDecision = {
      questionId: currentQuestion._id,
      selectedChoiceId: choice._id,
    };

    const updatedDecisions = [...decisions, newDecision];
    setDecisions(updatedDecisions);
    setSelectedChoice(choice);
    setShowFeedback(true);

    // Deduct fuel from current level (not reset to initial)
    const newFuelLevel = currentFuel - choice.fuelCost;
    setCurrentFuel(Math.max(0, newFuelLevel)); // Ensure fuel doesn't go negative

    // Animate fuel deduction
    if (choice.fuelCost > 1) {
      Animated.sequence([
        Animated.timing(fuelAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fuelAnim, {
          toValue: 1.05,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fuelAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Animate selection
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Wait for user to see feedback, then move to next question or finish
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedChoice(null);

      if (currentQuestionIndex < scenario.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        finishChallenge(updatedDecisions, scenario);
      }
    }, 2500); // Show feedback for 2.5 seconds
  };

  const finishChallenge = async (finalDecisions, scenario) => {
    setGameState("result");

    try {
      await dispatch(
        submitFuelChallenge({
          scenarioId: scenario._id,
          decisions: finalDecisions,
          isCompetitive,
        })
      ).unwrap();

      await dispatch(getUserFuelHistory({ page: 1, limit: 10 })).unwrap();
      await dispatch(getFuelLeaderboard({ limit: 10 })).unwrap();
    } catch (error) {
      Alert.alert(
        "Error",
        error || "Failed to submit challenge. Please try again."
      );
    }
  };

  const getFuelColor = (fuelLevel, maxFuel) => {
    const percentage = (fuelLevel / maxFuel) * 100;
    if (percentage > 60) return "#10B981";
    if (percentage > 30) return "#F59E0B";
    return "#EF4444";
  };

  const getFuelIcon = (fuelLevel, maxFuel) => {
    const percentage = (fuelLevel / maxFuel) * 100;
    if (percentage > 75) return "battery-full";
    if (percentage > 50) return "battery-half";
    if (percentage > 25) return "battery-charging";
    return "battery-dead";
  };

  const renderMenu = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Header Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Ionicons name="trophy" size={24} color="#FFD700" />
          <Text style={styles.statValue}>
            {userBestScore?.bestScore?.toFixed(0) || "0"}
          </Text>
          <Text style={styles.statLabel}>Best Score</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="flame" size={24} color="#F59E0B" />
          <Text style={styles.statValue}>{competitiveAttempts}/2</Text>
          <Text style={styles.statLabel}>Weekly Tries</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          <Text style={styles.statValue}>{fuelHistory?.length || 0}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Game Mode Selection */}
      <View style={styles.modeContainer}>
        <Text style={styles.sectionTitle}>Choose Challenge Mode</Text>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => startChallenge(true)}
          disabled={competitiveAttempts >= 2}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.modeCardContent,
              competitiveAttempts >= 2 && styles.disabledCard,
            ]}
          >
            <View style={styles.modeIcon}>
              <Ionicons name="trophy" size={40} color="#FFD700" />
            </View>
            <View style={styles.modeInfo}>
              <Text style={styles.modeTitle}>Weekly Competitive</Text>
              <Text style={styles.modeDescription}>
                Same scenario for all riders • 2 attempts per week
              </Text>
              <View style={styles.modeBadges}>
                <View style={styles.modeBadge}>
                  <Ionicons name="people" size={14} color="#FFF" />
                  <Text style={styles.modeBadgeText}>Weekly leaderboard</Text>
                </View>
                <View style={styles.modeBadge}>
                  <Ionicons name="star" size={14} color="#FFF" />
                  <Text style={styles.modeBadgeText}>Best score counts</Text>
                </View>
              </View>
            </View>
          </View>
          {competitiveAttempts >= 2 && (
            <View style={styles.lockedOverlay}>
              <Ionicons name="lock-closed" size={24} color="#FFF" />
              <Text style={styles.lockedText}>Weekly limit reached</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => startChallenge(false)}
          activeOpacity={0.8}
        >
          <View style={styles.modeCardContent}>
            <View
              style={[
                styles.modeIcon,
                { backgroundColor: "rgba(59, 130, 246, 0.2)" },
              ]}
            >
              <Ionicons name="bicycle" size={40} color="#3B82F6" />
            </View>
            <View style={styles.modeInfo}>
              <Text style={styles.modeTitle}>Practice Mode</Text>
              <Text style={styles.modeDescription}>
                Random scenarios • Unlimited attempts
              </Text>
              <View style={styles.modeBadges}>
                <View
                  style={[
                    styles.modeBadge,
                    { backgroundColor: "rgba(59, 130, 246, 0.3)" },
                  ]}
                >
                  <Ionicons name="infinite" size={14} color="#FFF" />
                  <Text style={styles.modeBadgeText}>No limits</Text>
                </View>
                <View
                  style={[
                    styles.modeBadge,
                    { backgroundColor: "rgba(59, 130, 246, 0.3)" },
                  ]}
                >
                  <Ionicons name="school" size={14} color="#FFF" />
                  <Text style={styles.modeBadgeText}>Learn strategies</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* User Rank Display */}
      {userBestScore && (
        <View style={styles.rankCard}>
          <View style={styles.rankHeader}>
            <Ionicons name="podium" size={24} color="#FFD700" />
            <Text style={styles.rankTitle}>Your Weekly Ranking</Text>
          </View>
          <View style={styles.rankContent}>
            <View style={styles.rankItem}>
              <Text style={styles.rankLabel}>Position</Text>
              <Text style={styles.rankValue}>#{userBestScore.rank}</Text>
            </View>
            <View style={styles.rankDivider} />
            <View style={styles.rankItem}>
              <Text style={styles.rankLabel}>Best Score</Text>
              <Text style={styles.rankValue}>
                {userBestScore.bestScore?.toFixed(0)}
              </Text>
            </View>
            <View style={styles.rankDivider} />
            <View style={styles.rankItem}>
              <Text style={styles.rankLabel}>Fuel Left</Text>
              <Text style={styles.rankValue}>
                {userBestScore.fuelRemaining?.toFixed(1)}L
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            dispatch(getUserFuelHistory({ page: 1, limit: 10 }));
            setGameState("history");
          }}
        >
          <Ionicons name="list" size={20} color="#FFF" />
          <Text style={styles.actionButtonText}>View History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            dispatch(getFuelLeaderboard({ limit: 10 }));
            setGameState("leaderboard");
          }}
        >
          <Ionicons name="podium" size={20} color="#FFF" />
          <Text style={styles.actionButtonText}>Leaderboard</Text>
        </TouchableOpacity>
      </View>

      {/* How to Play */}
      <View style={styles.howToPlayContainer}>
        <Text style={styles.howToPlayTitle}>How to Play</Text>
        <View style={styles.howToPlayItem}>
          <Ionicons name="speedometer" size={20} color="#F59E0B" />
          <Text style={styles.howToPlayText}>
            Make smart riding decisions to conserve fuel
          </Text>
        </View>
        <View style={styles.howToPlayItem}>
          <Ionicons name="warning" size={20} color="#F59E0B" />
          <Text style={styles.howToPlayText}>
            Bad choices consume more fuel - choose wisely!
          </Text>
        </View>
        <View style={styles.howToPlayItem}>
          <Ionicons name="trophy" size={20} color="#F59E0B" />
          <Text style={styles.howToPlayText}>
            Finish with the most fuel remaining to top the leaderboard
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderChallenge = () => {
    if (!fuelChallenge) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
          <Text style={styles.loadingText}>Loading challenge...</Text>
        </View>
      );
    }

    // Handle both response formats
    const scenario =
      fuelChallenge.challenge || fuelChallenge.scenario || fuelChallenge;

    if (!scenario || !scenario.questions || scenario.questions.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
          <Text style={styles.loadingText}>Loading challenge...</Text>
        </View>
      );
    }

    const currentQuestion = scenario.questions[currentQuestionIndex];
    const progress = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
    });
    const fuelPercentage = (currentFuel / scenario.initialFuel) * 100;

    return (
      <View style={styles.challengeContainer}>
        {/* Scenario Info */}
        {currentQuestionIndex === 0 && (
          <View style={styles.scenarioCard}>
            <View style={styles.scenarioHeader}>
              <Ionicons name="map" size={24} color="#F59E0B" />
              <Text style={styles.scenarioTitle}>{scenario.title}</Text>
            </View>
            <Text style={styles.scenarioDescription}>
              {scenario.description}
            </Text>
            <View style={styles.scenarioStats}>
              <View style={styles.scenarioStat}>
                <Ionicons name="location" size={16} color="#9CA3AF" />
                <Text style={styles.scenarioStatText}>
                  {scenario.distance} km
                </Text>
              </View>
              <View style={styles.scenarioStat}>
                <Ionicons name="water" size={16} color="#9CA3AF" />
                <Text style={styles.scenarioStatText}>
                  {scenario.initialFuel?.toFixed(1)}L fuel
                </Text>
              </View>
              {scenario.terrain && (
                <View style={styles.scenarioStat}>
                  <Ionicons name="trail-sign" size={16} color="#9CA3AF" />
                  <Text style={styles.scenarioStatText}>
                    {scenario.terrain}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <Animated.View style={[styles.progressBar, { width: progress }]} />
          </View>
          <Text style={styles.progressText}>
            Decision {currentQuestionIndex + 1} of {scenario.questions.length}
          </Text>
        </View>

        {/* Fuel Gauge */}
        <Animated.View
          style={[styles.fuelGauge, { transform: [{ scale: fuelAnim }] }]}
        >
          <View style={styles.fuelGaugeHeader}>
            <Ionicons
              name={getFuelIcon(currentFuel, scenario.initialFuel)}
              size={28}
              color={getFuelColor(currentFuel, scenario.initialFuel)}
            />
            <Text style={styles.fuelLabel}>FUEL REMAINING</Text>
          </View>
          <View style={styles.fuelBarContainer}>
            <View style={styles.fuelBarBg}>
              <View
                style={[
                  styles.fuelBar,
                  {
                    width: `${fuelPercentage}%`,
                    backgroundColor: getFuelColor(
                      currentFuel,
                      scenario.initialFuel
                    ),
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.fuelValue,
                { color: getFuelColor(currentFuel, scenario.initialFuel) },
              ]}
            >
              {currentFuel.toFixed(1)}L / {scenario.initialFuel?.toFixed(1)}L
            </Text>
          </View>
          {fuelPercentage < 30 && (
            <Text style={styles.fuelWarning}>
              ⚠️ Low fuel! Choose carefully
            </Text>
          )}
        </Animated.View>

        {/* Question */}
        <ScrollView style={styles.questionScrollContainer}>
          <View style={styles.questionContainer}>
            <View style={styles.questionHeader}>
              <Ionicons name="help-circle" size={24} color="#F59E0B" />
              <Text style={styles.questionLabel}>Situation</Text>
            </View>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          {/* Choices */}
          <View style={styles.choicesContainer}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedChoice?._id === option._id;
              const isOptimal =
                option.fuelCost === currentQuestion.optimalFuelCost;

              return (
                <TouchableOpacity
                  key={option._id}
                  style={[
                    styles.choiceButton,
                    isSelected && styles.choiceButtonSelected,
                    showFeedback &&
                      isSelected &&
                      isOptimal &&
                      styles.choiceButtonOptimal,
                    showFeedback &&
                      isSelected &&
                      !isOptimal &&
                      styles.choiceButtonSuboptimal,
                  ]}
                  onPress={() => handleChoiceSelect(option)}
                  activeOpacity={0.7}
                  disabled={selectedChoice !== null}
                >
                  <View style={styles.choiceContent}>
                    <View style={styles.choiceLeft}>
                      <View
                        style={[
                          styles.choiceCircle,
                          isSelected && styles.choiceCircleSelected,
                        ]}
                      >
                        {isSelected && showFeedback ? (
                          <Ionicons
                            name={isOptimal ? "checkmark" : "close"}
                            size={20}
                            color="#FFF"
                          />
                        ) : (
                          <Text style={styles.choiceLetter}>
                            {String.fromCharCode(65 + index)}
                          </Text>
                        )}
                      </View>
                      <Text style={styles.choiceText}>{option.text}</Text>
                    </View>

                    {/* Only show fuel cost after selection */}
                    {showFeedback && isSelected && (
                      <View
                        style={[
                          styles.fuelCostBadge,
                          isOptimal
                            ? styles.fuelCostBadgeGood
                            : styles.fuelCostBadgeBad,
                        ]}
                      >
                        <Ionicons name="water" size={14} color="#FFF" />
                        <Text style={styles.fuelCostText}>
                          -{option.fuelCost.toFixed(1)}L
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Show feedback after selection */}
                  {showFeedback && isSelected && (
                    <View style={styles.feedbackContainer}>
                      <Text style={styles.feedbackText}>{option.feedback}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderResult = () => {
    if (!fuelResult) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
        </View>
      );
    }

    // Get scenario from fuelChallenge
    const scenario =
      fuelChallenge?.challenge || fuelChallenge?.scenario || fuelChallenge;
    const initialFuel = scenario?.initialFuel || 100;
    const efficiency = (fuelResult.fuelRemaining / initialFuel) * 100;

    return (
      <ScrollView contentContainerStyle={styles.resultContainer}>
        <View style={styles.resultHeader}>
          <Ionicons
            name={
              efficiency >= 70
                ? "trophy"
                : efficiency >= 50
                ? "ribbon"
                : "medal"
            }
            size={80}
            color={
              efficiency >= 70
                ? "#FFD700"
                : efficiency >= 50
                ? "#C0C0C0"
                : "#CD7F32"
            }
          />
          <Text style={styles.resultTitle}>Challenge Complete!</Text>
          <Text style={styles.resultScore}>
            {fuelResult.efficiencyScore.toFixed(0)}%
          </Text>
          <Text style={styles.resultSubtitle}>Efficiency Score</Text>
        </View>

        {/* Fuel Stats */}
        <View style={styles.fuelResultCard}>
          <View style={styles.fuelResultHeader}>
            <Ionicons name="water" size={24} color="#10B981" />
            <Text style={styles.fuelResultTitle}>Fuel Management</Text>
          </View>
          <View style={styles.fuelResultStats}>
            <View style={styles.fuelResultStat}>
              <Text style={styles.fuelResultLabel}>Remaining</Text>
              <Text style={[styles.fuelResultValue, { color: "#10B981" }]}>
                {fuelResult.fuelRemaining.toFixed(1)}L
              </Text>
            </View>
            <View style={styles.fuelResultStat}>
              <Text style={styles.fuelResultLabel}>Used</Text>
              <Text style={[styles.fuelResultValue, { color: "#EF4444" }]}>
                {fuelResult.fuelUsed.toFixed(1)}L
              </Text>
            </View>
            <View style={styles.fuelResultStat}>
              <Text style={styles.fuelResultLabel}>Optimal</Text>
              <Text style={[styles.fuelResultValue, { color: "#3B82F6" }]}>
                {fuelResult.optimalFuelUsed.toFixed(1)}L
              </Text>
            </View>
          </View>
        </View>

        {/* Decision Stats */}
        <View style={styles.resultStats}>
          <View style={styles.resultStatBox}>
            <Text style={styles.resultStatValue}>
              {fuelResult.correctDecisions}
            </Text>
            <Text style={styles.resultStatLabel}>Optimal Choices</Text>
          </View>
          <View style={styles.resultStatBox}>
            <Text style={styles.resultStatValue}>
              {fuelResult.totalQuestions}
            </Text>
            <Text style={styles.resultStatLabel}>Total Decisions</Text>
          </View>
          <View style={styles.resultStatBox}>
            <Text style={styles.resultStatValue}>
              {(
                (fuelResult.correctDecisions / fuelResult.totalQuestions) *
                100
              ).toFixed(0)}
              %
            </Text>
            <Text style={styles.resultStatLabel}>Accuracy</Text>
          </View>
        </View>

        {/* Ranking */}
        {isCompetitive && fuelResult.ranking && (
          <View style={styles.rankingCard}>
            <Ionicons name="podium" size={32} color="#FFD700" />
            <Text style={styles.rankingText}>You ranked</Text>
            <Text style={styles.rankingPosition}>#{fuelResult.ranking}</Text>
            <Text style={styles.rankingSubtext}>
              on the weekly leaderboard!
            </Text>
          </View>
        )}

        {/* Detailed Results */}
        <TouchableOpacity
          style={styles.detailsToggle}
          onPress={() => {
            // Toggle details view
            Alert.alert(
              "Decision Breakdown",
              fuelResult.decisions
                .map(
                  (d, i) =>
                    `${i + 1}. ${d.selectedChoice}\n` +
                    `Fuel: -${d.fuelCost.toFixed(1)}L ${
                      d.isOptimal ? "✅" : "❌"
                    }\n` +
                    `${d.feedback}`
                )
                .join("\n\n")
            );
          }}
        >
          <Ionicons name="list" size={20} color="#F59E0B" />
          <Text style={styles.detailsToggleText}>View Decision Breakdown</Text>
        </TouchableOpacity>

        <View style={styles.resultActions}>
          <TouchableOpacity
            style={styles.resultButton}
            onPress={() => setGameState("menu")}
          >
            <Ionicons name="home" size={20} color="#FFF" />
            <Text style={styles.resultButtonText}>Back to Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resultButton, styles.resultButtonSecondary]}
            onPress={() => {
              dispatch(getFuelLeaderboard({ limit: 10 }));
              setGameState("leaderboard");
            }}
          >
            <Ionicons name="podium" size={20} color="#F59E0B" />
            <Text
              style={[
                styles.resultButtonText,
                styles.resultButtonTextSecondary,
              ]}
            >
              Leaderboard
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderHistory = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.sectionTitle}>Challenge History</Text>
      {fuelHistory && fuelHistory.length > 0 ? (
        fuelHistory.map((challenge, index) => (
          <View key={index} style={styles.historyItem}>
            <View style={styles.historyLeft}>
              <Ionicons
                name={challenge.isCompetitive ? "trophy" : "bicycle"}
                size={24}
                color={challenge.isCompetitive ? "#FFD700" : "#3B82F6"}
              />
              <View style={styles.historyInfo}>
                <Text style={styles.historyTitle}>
                  {challenge.scenarioTitle}
                </Text>
                <Text style={styles.historyDate}>
                  {new Date(challenge.completedAt).toLocaleDateString()}
                </Text>
                <Text style={styles.historyMode}>
                  {challenge.isCompetitive ? "Competitive" : "Practice"}
                </Text>
              </View>
            </View>
            <View style={styles.historyRight}>
              <Text style={styles.historyScore}>
                {challenge.efficiencyScore.toFixed(0)}%
              </Text>
              <Text style={styles.historyFuel}>
                {challenge.fuelRemaining.toFixed(1)}L left
              </Text>
              <Text style={styles.historyCorrect}>
                {challenge.correctDecisions}/{challenge.totalQuestions} optimal
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No challenge history yet</Text>
      )}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setGameState("menu")}
      >
        <Text style={styles.backButtonText}>Back to Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderLeaderboard = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.sectionTitle}>Weekly Leaderboard</Text>
      {weekStart && (
        <Text style={styles.weekText}>
          Week of {new Date(weekStart).toLocaleDateString()}
        </Text>
      )}
      {fuelLeaderboard && fuelLeaderboard.length > 0 ? (
        fuelLeaderboard.map((entry) => (
          <View key={entry.rank} style={styles.leaderboardItem}>
            <View style={styles.leaderboardRank}>
              {entry.rank <= 3 ? (
                <Ionicons
                  name="medal"
                  size={28}
                  color={
                    entry.rank === 1
                      ? "#FFD700"
                      : entry.rank === 2
                      ? "#C0C0C0"
                      : "#CD7F32"
                  }
                />
              ) : (
                <Text style={styles.rankText}>{entry.rank}</Text>
              )}
            </View>
            <View style={styles.leaderboardInfo}>
              <Text style={styles.leaderboardName}>
                {entry.userName || "Anonymous"}
              </Text>
              <Text style={styles.leaderboardDetails}>
                {entry.fuelRemaining?.toFixed(1)}L remaining •{" "}
                {entry.correctDecisions} optimal
              </Text>
            </View>
            <Text style={styles.leaderboardScore}>
              {entry.bestScore.toFixed(0)}%
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No leaderboard data yet</Text>
      )}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setGameState("menu")}
      >
        <Text style={styles.backButtonText}>Back to Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => {
            if (gameState === "challenge") {
              Alert.alert(
                "Exit Challenge",
                "Are you sure? Your progress will be lost.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Exit", onPress: () => navigation.goBack() },
                ]
              );
            } else {
              navigation.goBack();
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>FUEL CHALLENGE</Text>
          <Text style={styles.headerSubtitle}>Ride Smart, Save Fuel</Text>
        </View>
        <View style={styles.headerIconContainer}>
          <Ionicons name="speedometer" size={28} color="#F59E0B" />
        </View>
      </View>

      {gameState === "menu" && renderMenu()}
      {gameState === "challenge" && renderChallenge()}
      {gameState === "result" && renderResult()}
      {gameState === "history" && renderHistory()}
      {gameState === "leaderboard" && renderLeaderboard()}
    </View>
  );
};

export default FuelGame;
