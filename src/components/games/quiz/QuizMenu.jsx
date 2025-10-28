// components/QuizMenu.js
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { quizGameStyles as styles } from "../../../styles/QuizGame";

const QuizMenu = ({
  quizHistory,
  competitiveTries,
  onStartQuiz,
  onViewHistory,
  onViewLeaderboard,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Header Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Ionicons name="trophy" size={24} color="#FFD700" />
          <Text style={styles.statValue}>
            {quizHistory?.filter((q) => q.isCompetitive).length || 0}
          </Text>
          <Text style={styles.statLabel}>Competitive Played</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="flame" size={24} color="#FF6B00" />
          <Text style={styles.statValue}>{competitiveTries}/3</Text>
          <Text style={styles.statLabel}>Weekly Tries</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          <Text style={styles.statValue}>{quizHistory?.length || 0}</Text>
          <Text style={styles.statLabel}>Total Quizzes</Text>
        </View>
      </View>

      {/* Game Mode Selection */}
      <View style={styles.modeContainer}>
        <Text style={styles.sectionTitle}>Choose Game Mode</Text>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => onStartQuiz(true)}
          disabled={competitiveTries >= 3}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.modeCardContent,
              competitiveTries >= 3 && styles.disabledCard,
            ]}
          >
            <View style={styles.modeIcon}>
              <Ionicons name="trophy" size={40} color="#FFD700" />
            </View>
            <View style={styles.modeInfo}>
              <Text style={styles.modeTitle}>Competitive Mode</Text>
              <Text style={styles.modeDescription}>
                Compete for weekly leaderboard • 3 tries per week
              </Text>
              <View style={styles.modeBadges}>
                <View style={styles.modeBadge}>
                  <Ionicons name="time" size={14} color="#FFF" />
                  <Text style={styles.modeBadgeText}>60s per question</Text>
                </View>
                <View style={styles.modeBadge}>
                  <Ionicons name="help-circle" size={14} color="#FFF" />
                  <Text style={styles.modeBadgeText}>10 questions</Text>
                </View>
              </View>
            </View>
          </View>
          {competitiveTries >= 3 && (
            <View style={styles.lockedOverlay}>
              <Ionicons name="lock-closed" size={24} color="#FFF" />
              <Text style={styles.lockedText}>Weekly limit reached</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => onStartQuiz(false)}
          activeOpacity={0.8}
        >
          <View style={styles.modeCardContent}>
            <View
              style={[
                styles.modeIcon,
                { backgroundColor: "rgba(59, 130, 246, 0.2)" },
              ]}
            >
              <Ionicons name="school" size={40} color="#3B82F6" />
            </View>
            <View style={styles.modeInfo}>
              <Text style={styles.modeTitle}>Practice Mode</Text>
              <Text style={styles.modeDescription}>
                Test your knowledge • Unlimited attempts
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
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onViewHistory}>
          <Ionicons name="list" size={20} color="#FFF" />
          <Text style={styles.actionButtonText}>View History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onViewLeaderboard}
        >
          <Ionicons name="podium" size={20} color="#FFF" />
          <Text style={styles.actionButtonText}>Leaderboard</Text>
        </TouchableOpacity>
      </View>

      {/* How to Play */}
      <View style={styles.howToPlayContainer}>
        <Text style={styles.howToPlayTitle}>How to Play</Text>
        <View style={styles.howToPlayItem}>
          <Ionicons name="help-circle" size={20} color="#10B981" />
          <Text style={styles.howToPlayText}>
            Answer 10 motorcycle knowledge questions
          </Text>
        </View>
        <View style={styles.howToPlayItem}>
          <Ionicons name="time" size={20} color="#10B981" />
          <Text style={styles.howToPlayText}>
            60 seconds per question - faster = higher score
          </Text>
        </View>
        <View style={styles.howToPlayItem}>
          <Ionicons name="trophy" size={20} color="#10B981" />
          <Text style={styles.howToPlayText}>
            Compete for top 10 spot on weekly leaderboard
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default QuizMenu;
