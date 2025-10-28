import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { quizGameStyles as styles } from "../../../styles/QuizGame";

const QuizQuestion = ({
  questions,
  currentQuestionIndex,
  timer,
  progressAnim,
  onAnswerSelect,
  loading,
}) => {
  if (!questions || questions.length === 0 || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.quizContainer}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBar, { width: progress }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Ionicons
          name="time"
          size={24}
          color={timer <= 10 ? "#EF4444" : "#10B981"}
        />
        <Text style={[styles.timerText, timer <= 10 && styles.timerWarning]}>
          {timer}s
        </Text>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      {/* Options */}
      <ScrollView style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => onAnswerSelect(option)}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionCircle}>
                <Text style={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default QuizQuestion;
