import React from "react";
import { View, Text, Image } from "react-native";
import { postDetailStyles as styles } from "../../styles/PostDetailStyles";

const UserInfoSection = ({ createdBy, createdAt }) => {
  return (
    <View style={styles.userSection}>
      <View style={styles.avatar}>
        {createdBy?.avatar?.url ? (
          <Image
            source={{ uri: createdBy.avatar.url }}
            style={styles.avatarImage}
          />
        ) : (
          <Text style={styles.avatarText}>
            {createdBy?.name?.charAt(0).toUpperCase() || "U"}
          </Text>
        )}
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{createdBy?.name || "Anonymous"}</Text>
        <Text style={styles.timestamp}>
          {new Date(createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

export default UserInfoSection;