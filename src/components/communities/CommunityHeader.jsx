import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { communityDetailStyles as styles } from "../../styles/CommunityDetails";

const CommunityHeader = ({ onBack, onMore }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Community</Text>
      <TouchableOpacity style={styles.moreButton} onPress={onMore}>
        <Text style={styles.moreButtonText}>⋯</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CommunityHeader;