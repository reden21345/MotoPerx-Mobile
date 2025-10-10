import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { communityDetailStyles as styles } from "../../styles/CommunityDetails";

const PostCard = ({ item, user, onLike, onComment, onShare }) => {
  const isLiked = item.likes?.some(like => like.user === user?._id);
  const likesCount = item.likes?.length || 0;
  const commentsCount = item.comments?.length || 0;

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          source={{
            uri: item.createdBy?.avatar?.url || "https://via.placeholder.com/40",
          }}
          style={styles.postAvatar}
        />
        <View style={styles.postHeaderInfo}>
          <Text style={styles.postAuthor}>{item.createdBy?.name || "Anonymous"}</Text>
          <Text style={styles.postTime}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity style={styles.postMenuButton}>
          <Text style={styles.postMenuIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      {item.title && (
        <Text style={styles.postTitle}>{item.title}</Text>
      )}
      
      <Text style={styles.postContent}>{item.caption}</Text>
      
      {item.images && item.images.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.imageScrollContainer}
        >
          {item.images.map((image, index) => (
            <Image 
              key={index}
              source={{ uri: image.url }} 
              style={[
                styles.postImage,
                item.images.length > 1 && styles.postImageMultiple
              ]} 
            />
          ))}
        </ScrollView>
      )}

      {item.link && (
        <TouchableOpacity style={styles.linkPreview}>
          <Text style={styles.linkIcon}>🔗</Text>
          <Text style={styles.linkText} numberOfLines={1}>{item.link}</Text>
        </TouchableOpacity>
      )}

      {(likesCount > 0 || commentsCount > 0) && (
        <View style={styles.postStats}>
          {likesCount > 0 && (
            <Text style={styles.postStatsText}>
              👍 {likesCount} {likesCount === 1 ? 'like' : 'likes'}
            </Text>
          )}
          {commentsCount > 0 && (
            <Text style={styles.postStatsText}>
              💬 {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
            </Text>
          )}
        </View>
      )}

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onLike?.(item)}>
          <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>
            {isLiked ? '👍' : '👍'} Like
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onComment?.(item)}>
          <Text style={styles.actionText}>💬 Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onShare?.(item)}>
          <Text style={styles.actionText}>↗️ Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCard;