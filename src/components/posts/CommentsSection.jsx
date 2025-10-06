import React from "react";
import { View, Text } from "react-native";
import { postDetailStyles as styles } from "../../styles/PostDetailStyles";
import CommentItem from "./CommentItem";

const CommentsSection = ({ comments, currentUserId, onEditComment, onDeleteComment }) => {
  return (
    <View style={styles.commentsSection}>
      <Text style={styles.commentsTitle}>
        Comments ({comments?.length || 0})
      </Text>
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            currentUserId={currentUserId}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
          />
        ))
      ) : (
        <Text style={styles.noCommentsText}>No comments yet</Text>
      )}
    </View>
  );
};

export default CommentsSection;