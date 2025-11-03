import React from "react";
import {
  View,
  Text,
  FlatList,
} from "react-native";
import { communityDetailStyles as styles } from "../../styles/CommunityDetails";
import MemberCard from "./MemberCard";

const MembersTab = ({ members, currentUserId, canRemove, onRemoveMember }) => {
  if (!members || members.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateIcon}>👥</Text>
        <Text style={styles.emptyStateText}>No members yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={members}
      renderItem={({ item }) => (
        <MemberCard 
          item={item}
          currentUserId={currentUserId}
          canRemove={canRemove}
          onRemove={onRemoveMember}
        />
      )}
      keyExtractor={(item) => item._id}
      scrollEnabled={false}
    />
  );
};

export default MembersTab;