import React from "react";
import {
  View,
  Text,
} from "react-native";
import { communityDetailStyles as styles } from "../../styles/CommunityDetails";

const AboutTab = ({ community }) => {
  return (
    <View style={styles.aboutContainer}>
      <View style={styles.aboutItem}>
        <Text style={styles.aboutLabel}>Status</Text>
        <Text style={styles.aboutValue}>{community.status}</Text>
      </View>
      <View style={styles.aboutItem}>
        <Text style={styles.aboutLabel}>Privacy</Text>
        <Text style={styles.aboutValue}>
          {community.isPrivate ? "Private Community" : "Public Community"}
        </Text>
      </View>
      <View style={styles.aboutItem}>
        <Text style={styles.aboutLabel}>Created</Text>
        <Text style={styles.aboutValue}>
          {new Date(community.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>
      <View style={styles.aboutItem}>
        <Text style={styles.aboutLabel}>Description</Text>
        <Text style={styles.aboutDescription}>
          {community.description}
        </Text>
      </View>
    </View>
  );
};

export default AboutTab;