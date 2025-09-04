import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { whatsOnMindStyles } from "../../styles/WhatsOnMindStyles";

const WhatsOnMind = ({ onPress }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <View style={whatsOnMindStyles.createPostSection}>
      <View style={whatsOnMindStyles.createPostContainer}>
        <View style={whatsOnMindStyles.createPostAvatar}>
          <Text style={whatsOnMindStyles.createPostAvatarText}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <TouchableOpacity 
          style={whatsOnMindStyles.createPostInput}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text style={whatsOnMindStyles.createPostPlaceholder}>
            What's on your mind?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WhatsOnMind;