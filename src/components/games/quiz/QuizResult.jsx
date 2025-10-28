import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { quizGameStyles as styles } from "../../../styles/QuizGame";

const QuizResult = ({
  quizResult,
  isCompetitive,
  onBackToMenu,
  onViewLeaderboard,
}) => {
  if (!quizResult) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  const percentage =
    (quizResult.correctAnswers / quizResult.totalQuestions) * 100;

  return (
    <ScrollView contentContainerStyle={styles.resultContainer}>
      <View style={styles.resultHeader}>
        <Ionicons
          name={
            percentage >= 80 ? "trophy" : percentage >= 60 ? "ribbon" : "medal"
          }
          size={80}
          color={
            percentage >= 80
              ? "#FFD700"
              : percentage >= 60
              ? "#C0C0C0"
              : "#CD7F32"
          }
        />
        <Text style={styles.resultTitle}>Quiz Complete!</Text>
        <Text style={styles.resultScore}>{quizResult.score} Points</Text>
      </View>

      <View style={styles.resultStats}>
        <View style={styles.resultStatBox}>
          <Text style={styles.resultStatValue}>
            {quizResult.correctAnswers}
          </Text>
          <Text style={styles.resultStatLabel}>Correct</Text>
        </View>
        <View style={styles.resultStatBox}>
          <Text style={styles.resultStatValue}>
            {quizResult.totalQuestions}
          </Text>
          <Text style={styles.resultStatLabel}>Total</Text>
        </View>
        <View style={styles.resultStatBox}>
          <Text style={styles.resultStatValue}>{percentage.toFixed(0)}%</Text>
          <Text style={styles.resultStatLabel}>Accuracy</Text>
        </View>
      </View>

      {isCompetitive && (
        <View style={styles.competitiveInfo}>
          <Ionicons name="information-circle" size={20} color="#3B82F6" />
          <Text style={styles.competitiveText}>
            Competitive score recorded! Check the leaderboard to see your
            ranking.
          </Text>
        </View>
      )}

      <View style={styles.resultActions}>
        <TouchableOpacity style={styles.resultButton} onPress={onBackToMenu}>
          <Ionicons name="home" size={20} color="#FFF" />
          <Text style={styles.resultButtonText}>Back to Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resultButton, styles.resultButtonSecondary]}
          onPress={onViewLeaderboard}
        >
          <Ionicons name="podium" size={20} color="#10B981" />
          <Text
            style={[styles.resultButtonText, styles.resultButtonTextSecondary]}
          >
            Leaderboard
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default QuizResult;
