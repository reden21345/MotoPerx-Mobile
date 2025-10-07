import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { whatsOnMindStyles as styles } from "../../styles/WhatsOnMindStyles";
import { postItemStyles as styles2 } from "../../styles/PostItemStyles";

const WhatsOnMind = ({ onPress, onCommunityPress }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <View style={styles.createPostSection}>
      <View style={styles.createPostContainer}>
        <View style={styles.createPostAvatar}>
          {user?.avatar?.url ? (
            <Image
              source={{
                uri: user?.avatar?.url,
              }}
              style={styles2.avatarImage}
            />
          ) : (
            <Text style={styles2.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          )}
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

      {/* Community Button */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.communityButton}
          onPress={onCommunityPress}
          activeOpacity={0.7}
        >
          <Ionicons name="people" size={20} color="#1877f2" />
          <Text style={styles.communityButtonText}>Community</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WhatsOnMind;