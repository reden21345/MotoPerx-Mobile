import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { postDetailStyles as styles } from "../../styles/PostDetailStyles";

const CommentItem = ({ comment, currentUserId, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const isOwner = comment.createdBy?._id === currentUserId;
  
  return (
    <View style={styles.commentContainer}>
      <View style={styles.commentAvatar}>
        {comment.createdBy?.avatar?.url ? (
          <Image
            source={{ uri: comment.createdBy.avatar.url }}
            style={styles.commentAvatarImage}
          />
        ) : (
          <Text style={styles.commentAvatarText}>
            {comment.createdBy?.name?.charAt(0).toUpperCase() || "?"}
          </Text>
        )}
      </View>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUserName}>
            {comment.createdBy?.name || "Anonymous"}
          </Text>
          {isOwner && (
            <TouchableOpacity
              style={styles.commentMenuButton}
              onPress={() => setShowMenu(true)}
            >
              <Text style={styles.commentMenuIcon}>⋯</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
        {comment.image?.url && (
          <Image
            source={{ uri: comment.image.url }}
            style={styles.commentImage}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Action Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onEdit(comment);
              }}
            >
              <Text style={styles.menuItemText}>✏️ Edit</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onDelete(comment._id);
              }}
            >
              <Text style={[styles.menuItemText, styles.deleteText]}>
                🗑️ Delete
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CommentItem;