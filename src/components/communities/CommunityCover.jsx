import React from "react";
import {
  View,
  Text,
} from "react-native";
import { communityDetailStyles as styles } from "../../styles/CommunityDetails";

const CommunityCover = ({ communityName }) => {
  return (
    <View style={styles.coverSection}>
      <View style={styles.coverGradient}>
        <View style={styles.communityIconContainer}>
          <Text style={styles.communityIcon}>
            {communityName?.charAt(0).toUpperCase() || "C"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CommunityCover;