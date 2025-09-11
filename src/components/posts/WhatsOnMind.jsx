import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { whatsOnMindStyles as styles } from "../../styles/WhatsOnMindStyles";

const WhatsOnMind = ({ onPress }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <View style={styles.createPostSection}>
      <View style={styles.createPostContainer}>
        <View style={styles.createPostAvatar}>
          <Text style={styles.createPostAvatarText}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.createPostInput}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text style={styles.createPostPlaceholder}>
            What's on your mind?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WhatsOnMind;