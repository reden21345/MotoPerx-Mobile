import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  Vibration,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { reactionGame as styles } from "../../styles/ReactionGame";
import {
  getUserReactionGames,
  saveReactionTime,
  getReactionLeaderboard,
} from "../../redux/actions/gameAction";

const ReactionGame = () => {
  const dispatch = useDispatch();
  const { reactionRecords, reactionLeaderboard, loading, error } = useSelector(
    (state) => state.games
  );

  const [gameState, setGameState] = useState("idle"); // idle, waiting, ready, result
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [tooEarly, setTooEarly] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef(null);

  useEffect(() => {
    dispatch(getUserReactionGames());
    dispatch(getReactionLeaderboard());

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (gameState === "ready") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [gameState]);

  const playVibration = (pattern) => {
    try {
      Vibration.vibrate(pattern);
    } catch (error) {
      console.log("Vibration not supported:", error);
    }
  };

  const startGame = () => {
    setTooEarly(false);
    setReactionTime(null);
    setGameState("waiting");
    playVibration(100); // Short vibration on start

    const randomDelay = Math.random() * 3000 + 2000; // 2-5 seconds

    timeoutRef.current = setTimeout(() => {
      setGameState("ready");
      setStartTime(Date.now());
      playVibration([0, 50, 100, 50]); // Double vibration for "GO!"
    }, randomDelay);
  };

  const handlePress = async () => {
    if (gameState === "idle") {
      startGame();
    } else if (gameState === "waiting") {
      // Too early!
      clearTimeout(timeoutRef.current);
      setTooEarly(true);
      setGameState("result");
      playVibration([0, 100, 100, 100]); // Error vibration pattern

      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (gameState === "ready") {
      // Calculate reaction time
      const endTime = Date.now();
      const reaction = endTime - startTime;
      setReactionTime(reaction);
      setGameState("result");

      // Play appropriate vibration based on reaction time
      if (reaction < 300) {
        playVibration([0, 50, 50, 50, 50, 50]); // Success vibration
      } else {
        playVibration(50); // Normal tap vibration
      }

      // Save to backend
      try {
        await dispatch(saveReactionTime({ reactionTime: reaction })).unwrap();
        dispatch(getReactionLeaderboard());
      } catch (error) {
        console.log("Error saving reaction time:", error);
        Alert.alert("Error", "Failed to save reaction time. Please try again.");
      }

      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (gameState === "result") {
      setGameState("idle");
    }
  };

  const resetGame = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setGameState("idle");
    setTooEarly(false);
    setReactionTime(null);
  };

  const getBackgroundColor = () => {
    if (gameState === "waiting") return ["#EF4444", "#DC2626"];
    if (gameState === "ready") return ["#10B981", "#059669"];
    if (gameState === "result" && tooEarly) return ["#F59E0B", "#D97706"];
    return ["#3B82F6", "#2563EB"];
  };

  const getInstructions = () => {
    if (gameState === "idle") return "Tap to Start";
    if (gameState === "waiting") return "Wait for GREEN...";
    if (gameState === "ready") return "TAP NOW!";
    if (tooEarly) return "Too Early!";
    return `${reactionTime}ms`;
  };

  const getIcon = () => {
    if (gameState === "idle") return "play-circle";
    if (gameState === "waiting") return "timer";
    if (gameState === "ready") return "flash";
    if (tooEarly) return "close-circle";
    return "trophy";
  };

  const getFeedback = () => {
    if (!reactionTime) return "";
    if (reactionTime < 200) return "Lightning Fast! ⚡";
    if (reactionTime < 300) return "Excellent! 🎯";
    if (reactionTime < 400) return "Good! 👍";
    if (reactionTime < 500) return "Not bad! 👌";
    return "Keep practicing! 💪";
  };

  return (
    <View style={styles.container}>
      <View style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Personal Best</Text>
              <Text style={styles.statValue}>
                {reactionRecords?.fastestRecord
                  ? `${reactionRecords.fastestRecord}ms`
                  : "---"}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Attempts</Text>
              <Text style={styles.statValue}>
                {reactionRecords?.record?.length || 0}
              </Text>
            </View>
          </View>

          {/* Game Area */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePress}
            disabled={loading}
            style={styles.gameAreaWrapper}
          >
            <Animated.View
              style={[
                styles.gameAreaAnimated,
                {
                  transform: [
                    { scale: gameState === "ready" ? pulseAnim : scaleAnim },
                  ],
                },
              ]}
            >
              <View
                style={[
                  styles.gameArea,
                  { backgroundColor: getBackgroundColor()[0] },
                ]}
              >
                {loading && gameState === "result" ? (
                  <ActivityIndicator size="large" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name={getIcon()} size={80} color="#FFF" />
                    <Text style={styles.instructionText}>
                      {getInstructions()}
                    </Text>
                    {gameState === "result" && !tooEarly && (
                      <Text style={styles.feedbackText}>{getFeedback()}</Text>
                    )}
                    {tooEarly && (
                      <Text style={styles.tooEarlyText}>
                        Wait for the green signal!
                      </Text>
                    )}
                  </>
                )}
              </View>
            </Animated.View>
          </TouchableOpacity>

          {/* Instructions */}
          {gameState === "idle" && (
            <View style={styles.instructionsBox}>
              <Text style={styles.instructionsTitle}>How to Play:</Text>
              <Text style={styles.instructionsText}>
                1. Tap "Start" to begin{"\n"}
                2. Wait for the RED screen{"\n"}
                3. When it turns GREEN, tap as fast as you can!{"\n"}
                4. Try to beat your best time
              </Text>
            </View>
          )}

          {/* Reset Button */}
          {gameState !== "idle" && (
            <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
              <Ionicons name="refresh" size={20} color="#FFF" />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          )}

          {/* Recent Records */}
          {reactionRecords?.record && reactionRecords.record.length > 0 && (
            <View style={styles.recordsContainer}>
              <Text style={styles.recordsTitle}>Recent Attempts</Text>
              <View style={styles.recordsList}>
                {reactionRecords.record
                  .slice(-5)
                  .reverse()
                  .map((record, index) => (
                    <View key={index} style={styles.recordItem}>
                      <Text style={styles.recordNumber}>#{index + 1}</Text>
                      <Text style={styles.recordTime}>
                        {record.reactionTime}ms
                      </Text>
                      {record.reactionTime ===
                        reactionRecords.fastestRecord && (
                        <Ionicons name="star" size={16} color="#FBBF24" />
                      )}
                    </View>
                  ))}
              </View>
            </View>
          )}

          {/* Leaderboard Toggle */}
          <TouchableOpacity
            style={styles.leaderboardButton}
            onPress={() => {
              setShowLeaderboard(!showLeaderboard);
              if (!showLeaderboard) {
                dispatch(getReactionLeaderboard());
              }
            }}
          >
            <Ionicons name="podium" size={20} color="#FFF" />
            <Text style={styles.leaderboardButtonText}>
              {showLeaderboard ? "Hide" : "Show"} Leaderboard
            </Text>
          </TouchableOpacity>

          {/* Leaderboard */}
          {showLeaderboard && (
            <View style={styles.leaderboardContainer}>
              <Text style={styles.leaderboardTitle}>Top 10 Players</Text>
              {reactionLeaderboard && reactionLeaderboard.length > 0 ? (
                reactionLeaderboard.map((entry, index) => (
                  <View key={entry._id} style={styles.leaderboardItem}>
                    <View style={styles.leaderboardRank}>
                      {index < 3 ? (
                        <Ionicons
                          name="medal"
                          size={24}
                          color={
                            index === 0
                              ? "#FFD700"
                              : index === 1
                              ? "#C0C0C0"
                              : "#CD7F32"
                          }
                        />
                      ) : (
                        <Text style={styles.rankText}>{index + 1}</Text>
                      )}
                    </View>
                    <Text style={styles.leaderboardName} numberOfLines={1}>
                      {entry.user?.name || "Anonymous"}
                    </Text>
                    <Text style={styles.leaderboardTime}>
                      {entry.fastestRecord}ms
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No leaderboard data yet</Text>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default ReactionGame;