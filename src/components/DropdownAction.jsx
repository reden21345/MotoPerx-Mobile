import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { postItemStyles as styles } from "../styles/PostItemStyles";

const DropdownAction = ({
  visible,
  isOwner,
  onEdit,
  onDelete,
  onReport,
  style,
}) => {
  if (!visible) return null;

  return (
    <View style={[styles.dropdownMenu, style]}>
      {isOwner ? (
        <>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Text style={styles.dropdownIcon}>✏️</Text>
            <Text style={styles.dropdownText}>Edit Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dropdownItem, styles.deleteItem]}
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Text style={styles.dropdownIcon}>🗑️</Text>
            <Text style={[styles.dropdownText, styles.deleteText]}>
              Delete Post
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.dropdownItem}
          onPress={(e) => {
            e.stopPropagation();
            onReport();
          }}
        >
          <Text style={styles.dropdownIcon}>🚨</Text>
          <Text style={styles.dropdownText}>Report Post</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DropdownAction;
