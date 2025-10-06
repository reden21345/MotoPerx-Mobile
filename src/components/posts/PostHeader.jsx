import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { postDetailStyles as styles } from "../../styles/PostDetailStyles";

const PostHeader = ({ onBack, onMore }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Post</Text>
      <TouchableOpacity style={styles.moreButton} onPress={onMore}>
        <Text style={styles.moreButtonText}>⋯</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostHeader;