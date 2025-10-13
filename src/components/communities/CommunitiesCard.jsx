import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { communitiesStyles as styles } from "../../styles/CommunitiesStyles";
import { getInitials } from "../../utils/helpers";

const CommunitiesCard = ({ item, navigation, status, onJoin }) => {
  const memberCount = item.members?.length || 0;
  const postCount = item.posts?.length || 0;
  const isPrivate = item.isPrivate;

  // Determine card border color based on status
  const getCardStyle = () => {
    const baseStyle = styles.card;
    if (status === "creator") {
      return [baseStyle, styles.cardCreator];
    } else if (status === "joined") {
      return [baseStyle, styles.cardJoined];
    }
    return baseStyle;
  };

  const handleJoinPress = (e) => {
    e.stopPropagation();
    if (onJoin) {
      onJoin(item._id);
    }
  };

  return (
    <TouchableOpacity
      style={getCardStyle()}
      onPress={() =>
        navigation.navigate("CommunityDetails", { communityId: item._id })
      }
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar?.url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
            </View>
          )}
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.communityName} numberOfLines={1}>
              {item.name}
            </Text>
            {isPrivate && (
              <View style={styles.privateBadge}>
                <Text style={styles.privateBadgeText}>🔒 Private</Text>
              </View>
            )}
          </View>

          <Text
            style={styles.description}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.description}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{memberCount}</Text>
          <Text style={styles.statLabel}>
            {memberCount === 1 ? "Member" : "Members"}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{postCount}</Text>
          <Text style={styles.statLabel}>
            {postCount === 1 ? "Post" : "Posts"}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.creatorLabel}>Privacy</Text>
          <Text style={styles.creatorName} numberOfLines={1}>
            {isPrivate ? "Private" : "Public"}
          </Text>
        </View>
      </View>

      {/* Status Section */}
      <View style={styles.statusSection}>
        {status === "creator" && (
          <View style={styles.statusBadgeCreator}>
            <Text style={styles.statusTextCreator}>👑 You Created This</Text>
          </View>
        )}
        
        {status === "joined" && (
          <View style={styles.statusBadgeJoined}>
            <Text style={styles.statusTextJoined}>✓ Joined</Text>
          </View>
        )}
        
        {status === "available" && (
          <TouchableOpacity
            style={styles.joinButton}
            onPress={handleJoinPress}
            activeOpacity={0.7}
          >
            <Text style={styles.joinButtonText}>+ Join Community</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CommunitiesCard;