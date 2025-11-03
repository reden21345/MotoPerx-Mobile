import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; // or use your preferred icon library
import { communityDetailStyles as styles } from "../../styles/CommunityDetails";

const MemberCard = ({ item, currentUserId, canRemove, isOwner, onRemove, onChangeRole }) => {
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
      
      <View style={styles.actionButtons}>
        {isOwner && currentUserId !== item.user?._id && (
          <TouchableOpacity 
            style={styles.roleButton}
            onPress={() => onChangeRole?.(item)}
          >
            <Ionicons name="swap-horizontal" size={20} color="#98DB52" />
          </TouchableOpacity>
        )}
        
        {canRemove && currentUserId !== item.user?._id && (
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => onRemove?.(item)}
          >
            <Ionicons name="person-remove" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MemberCard;