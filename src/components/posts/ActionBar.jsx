import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { postDetailStyles as styles } from "../../styles/PostDetailStyles";

const ActionBar = ({ isLiked, likesCount, commentsCount, onLike }) => {
  return (
    <View style={styles.actionBar}>
      <TouchableOpacity style={styles.actionButton} onPress={onLike}>
        <Text style={[styles.actionIcon, isLiked && styles.likedIcon]}>
          {isLiked ? "❤️" : "🤍"}
        </Text>
        <Text style={[styles.actionText, isLiked && styles.likedText]}>
          {likesCount}
        </Text>
      </TouchableOpacity>

      <View style={styles.actionButton}>
        <Text style={styles.actionIcon}>💬</Text>
        <Text style={styles.actionText}>{commentsCount}</Text>
      </View>
    </View>
  );
};

export default ActionBar;