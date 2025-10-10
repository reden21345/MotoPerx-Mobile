import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { communityDetailStyles as styles } from "../../styles/CommunityDetails";

const MemberCard = ({ item, currentUserId, onRemove }) => {
  return (
    <View style={styles.memberCard}>
      <Image
        source={{
          uri: item.user?.avatar?.url || "https://via.placeholder.com/50",
        }}
        style={styles.memberAvatar}
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.user?.name || "Unknown"}</Text>
        <Text style={styles.memberRole}>{item.role}</Text>
        <Text style={styles.memberJoinDate}>
          Joined {new Date(item.joinedAt).toLocaleDateString()}
        </Text>
      </View>
      {item.role !== "Admin" && currentUserId !== item.user?._id && (
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => onRemove?.(item)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MemberCard;