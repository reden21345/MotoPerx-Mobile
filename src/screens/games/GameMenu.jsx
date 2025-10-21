import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { gameMenuStyles as styles } from "../../styles/GameMenu";

const GameMenu = ({ navigation }) => {
  const games = [
    {
      id: 1,
      title: "Reaction Time Challenge",
      subtitle: "Test your lightning-fast reflexes",
      description: "How fast can you react? Compete for the best time!",
      icon: "flash",
      gradient: ["#3B82F6", "#2563EB"],
      screen: "ReactionGame",
      difficulty: "Easy",
      players: "1,234",
    },
    {
      id: 2,
      title: "Quiz Game: Motorcycle Knowledge",
      subtitle: "Test your riding knowledge",
      description: "Answer questions about motorcycle safety and mechanics",
      icon: "book",
      gradient: ["#10B981", "#059669"],
      screen: "QuizGame",
      difficulty: "Medium",
      players: "856",
    },
    {
      id: 3,
      title: "Fuel Efficiency Challenge",
      subtitle: "Master fuel economy simulation",
      description: "Plan your route and manage fuel like a pro rider",
      icon: "speedometer",
      gradient: ["#F59E0B", "#D97706"],
      screen: "FuelGame",
      difficulty: "Hard",
      players: "432",
    },
  ];

  const renderGameCard = (game) => {
    return (
      <TouchableOpacity
        key={game.id}
        style={styles.gameCard}
        onPress={() => navigation.navigate(game.screen)}
        activeOpacity={0.9}
      >
        <View style={[styles.gameCardGradient, { backgroundColor: game.gradient[0] }]}>
          <View style={styles.gameCardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name={game.icon} size={40} color="#FFF" />
            </View>
            <View style={styles.gameCardHeaderRight}>
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>{game.difficulty}</Text>
              </View>
              <View style={styles.playersInfo}>
                <Ionicons name="people" size={14} color="#FFF" />
                <Text style={styles.playersText}>{game.players} playing</Text>
              </View>
            </View>
          </View>

          <View style={styles.gameCardContent}>
            <Text style={styles.gameCardTitle}>{game.title}</Text>
            <Text style={styles.gameCardSubtitle}>{game.subtitle}</Text>
            <Text style={styles.gameCardDescription}>{game.description}</Text>
          </View>

          <View style={styles.gameCardFooter}>
            <View style={styles.playButtonContainer}>
              <Text style={styles.playButtonText}>PLAY NOW</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      
      <View style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>RIDER GAMES</Text>
            <Text style={styles.headerSubtitle}>
              Choose Your Challenge
            </Text>
          </View>
          <View style={styles.headerIconContainer}>
            <Ionicons name="game-controller" size={28} color="#FF6B00" />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <View style={styles.welcomeGradient}>
              <Ionicons name="trophy" size={50} color="#FFD700" />
              <Text style={styles.welcomeTitle}>Welcome, Rider!</Text>
              <Text style={styles.welcomeText}>
                Challenge yourself with our exciting games and compete with
                fellow riders for the top spot!
              </Text>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Ionicons name="flame" size={24} color="#FF6B00" />
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Games</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="people" size={24} color="#3B82F6" />
              <Text style={styles.statValue}>2.5K+</Text>
              <Text style={styles.statLabel}>Players</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="trophy" size={24} color="#FFD700" />
              <Text style={styles.statValue}>Daily</Text>
              <Text style={styles.statLabel}>Rewards</Text>
            </View>
          </View>

          {/* Games List */}
          <View style={styles.gamesContainer}>
            <Text style={styles.sectionTitle}>Available Games</Text>
            {games.map((game) => renderGameCard(game))}
          </View>

          {/* Coming Soon Section */}
          <View style={styles.comingSoonSection}>
            <View style={styles.comingSoonHeader}>
              <Ionicons name="rocket" size={24} color="#9CA3AF" />
              <Text style={styles.comingSoonTitle}>Coming Soon</Text>
            </View>
            <Text style={styles.comingSoonText}>
              More exciting games are on the way! Stay tuned for updates.
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default GameMenu;