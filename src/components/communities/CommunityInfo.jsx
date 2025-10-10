import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { communityDetailStyles as styles } from "../../styles/CommunityDetails";

const CommunityInfo = ({ 
  community, 
  approvedMembersCount, 
  isMember,
  onCreatePost,
  onInvite,
  onJoin 
}) => {
  return (
    <View style={styles.infoSection}>
      <Text style={styles.communityName}>{community.name}</Text>
      <Text style={styles.communityDescription}>
        {community.description}
      </Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{approvedMembersCount}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{community.posts?.length || 0}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statBadge}>
            {community.isPrivate ? "🔒 Private" : "🌐 Public"}
          </Text>
        </View>
      </View>

      <View style={styles.creatorInfo}>
        <Text style={styles.creatorLabel}>Created by </Text>
        <Text style={styles.creatorName}>{community.creator?.name}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        {isMember ? (
          <>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={onCreatePost}
            >
              <Text style={styles.primaryButtonText}>
                ➕ Create Post
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={onInvite}
            >
              <Text style={styles.secondaryButtonText}>Invite</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={onJoin}
          >
            <Text style={styles.primaryButtonText}>
              {community.isPrivate ? "🔒 Request to Join" : "➕ Join Community"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CommunityInfo;