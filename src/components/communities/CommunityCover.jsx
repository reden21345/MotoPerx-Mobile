import React from "react";
import { View, Text, Image } from "react-native";
import { communityDetailStyles as styles } from "../../styles/CommunityDetails";

const CommunityCover = ({ communityName, avatar }) => {
  return (
    <View style={styles.coverSection}>
      <View style={styles.coverGradient}>
        <View style={styles.communityIconContainer}>
          {avatar?.url ? (
            <Image
              source={{ uri: avatar.url }}
              style={styles.communityAvatarImage}
            />
          ) : (
            <Text style={styles.communityIcon}>
              {communityName?.charAt(0).toUpperCase() || "C"}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default CommunityCover;
