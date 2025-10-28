import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { quizGameStyles as styles } from "../../../styles/QuizGame";

const QuizHistory = ({ quizHistory, onBackToMenu }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.sectionTitle}>Quiz History</Text>
      {quizHistory && quizHistory.length > 0 ? (
        quizHistory.map((quiz, index) => (
          <View key={index} style={styles.historyItem}>
            <View style={styles.historyLeft}>
              <Ionicons
                name={quiz.isCompetitive ? "trophy" : "school"}
                size={24}
                color={quiz.isCompetitive ? "#FFD700" : "#3B82F6"}
              />
              <View style={styles.historyInfo}>
                <Text style={styles.historyMode}>
                  {quiz.isCompetitive ? "Competitive" : "Practice"}
                </Text>
                <Text style={styles.historyDate}>
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.historyRight}>
              <Text style={styles.historyScore}>{quiz.score}</Text>
              <Text style={styles.historyCorrect}>
                {quiz.correctAnswers}/{quiz.totalQuestions}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No quiz history yet</Text>
      )}
      <TouchableOpacity style={styles.backButton} onPress={onBackToMenu}>
        <Text style={styles.backButtonText}>Back to Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default QuizHistory;
