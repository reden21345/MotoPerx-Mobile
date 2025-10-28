import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { quizGameStyles as styles } from "../../../styles/QuizGame";

const QuizHeader = ({ onBackPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerBackButton} onPress={onBackPress}>
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>MOTORCYCLE QUIZ</Text>
        <Text style={styles.headerSubtitle}>Test Your Knowledge</Text>
      </View>
      <View style={styles.headerIconContainer}>
        <Ionicons name="book" size={28} color="#10B981" />
      </View>
    </View>
  );
};

export default QuizHeader;
