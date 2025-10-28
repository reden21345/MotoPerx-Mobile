import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { quizGameStyles as styles } from "../../../styles/QuizGame";

const QuizLeaderboard = ({ quizLeaderboard, weekStart, onBackToMenu }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.sectionTitle}>Weekly Leaderboard</Text>
      {weekStart && (
        <Text style={styles.weekText}>
          Week of {new Date(weekStart).toLocaleDateString()}
        </Text>
      )}
      {quizLeaderboard && quizLeaderboard.length > 0 ? (
        quizLeaderboard.map((entry, index) => (
          <View key={entry._id} style={styles.leaderboardItem}>
            <View style={styles.leaderboardRank}>
              {index < 3 ? (
                <Ionicons
                  name="medal"
                  size={28}
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
            <View style={styles.leaderboardInfo}>
              <Text style={styles.leaderboardName}>
                {entry.user?.name || "Anonymous"}
              </Text>
              <Text style={styles.leaderboardDetails}>
                {entry.correctAnswers}/{entry.totalQuestions} correct
              </Text>
            </View>
            <Text style={styles.leaderboardScore}>{entry.score}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No leaderboard data yet</Text>
      )}
      <TouchableOpacity style={styles.backButton} onPress={onBackToMenu}>
        <Text style={styles.backButtonText}>Back to Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default QuizLeaderboard;
