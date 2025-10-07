import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { postItemStyles as styles } from "../../styles/PostItemStyles";
import { formatDateWithAgo } from "../../utils/helpers";

const PostItem = ({
  item,
  user,
  likedPosts,
  activeDropdown,
  onLike,
  onComment,
  onToggleDropdown,
  onEdit,
  onDelete,
  onReport,
  onCloseDropdown,
  onViewPost,
}) => {
  const isLiked = likedPosts.has(item?._id);
  const likesCount = (item?.likes?.length || 0) + (isLiked ? 1 : 0);
  const isOwner =
    String(user?._id) === String(item?.createdBy?._id || item?.createdBy);
  const showDropdown = activeDropdown === item?._id;

  const handlePostPress = () => {
    if (showDropdown) {
      onCloseDropdown();
    }
  };

  return (
    <TouchableOpacity 
      style={styles.postContainer} 
      activeOpacity={1} 
      onPress={handlePostPress}
    >
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            {item?.createdBy?.avatar?.url ? (
              <Image
                source={{
                  uri: item?.createdBy?.avatar?.url,
                }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>
                {item?.createdBy?.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            )}
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.name}>
              {item?.createdBy?.name || "Anonymous"}
            </Text>
            {item?.isCommunity && item?.communityName && (
              <Text style={styles.communityName}>
                in {item?.communityName}
              </Text>
            )}
            <Text style={styles.timestamp}>{formatDateWithAgo(item?.createdAt)}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={(e) => {
            e.stopPropagation();
            onToggleDropdown(item?._id);
          }}
        >
          <Text style={styles.moreText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      {showDropdown && (
        <View style={styles.dropdownMenu}>
          {isOwner ? (
            <>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
              >
                <Text style={styles.dropdownIcon}>✏️</Text>
                <Text style={styles.dropdownText}>Edit Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  styles.deleteItem,
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete(item?._id);
                }}
              >
                <Text style={styles.dropdownIcon}>🗑️</Text>
                <Text
                  style={[
                    styles.dropdownText,
                    styles.deleteText,
                  ]}
                >
                  Delete Post
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={(e) => {
                e.stopPropagation();
                onReport(item?._id);
              }}
            >
              <Text style={styles.dropdownIcon}>🚨</Text>
              <Text style={styles.dropdownText}>Report Post</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Post Content */}
      <View style={styles.postContent}>
        {item?.title && (
          <Text style={styles.postTitle}>{item?.title}</Text>
        )}
        <Text style={styles.postCaption}>{item?.caption}</Text>
      </View>

      {/* Images */}
      {item?.images?.length > 0 && (
        <View style={styles.imageContainer}>
          {item?.images.length === 1 ? (
            <Image
              source={{ uri: item?.images[0].url }}
              style={styles.singleImage}
              resizeMode="cover"
            />
          ) : (
            <FlatList
              data={item?.images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(img, index) => index.toString()}
              renderItem={({ item: img }) => (
                <Image
                  source={{ uri: img.url }}
                  style={styles.multipleImage}
                  resizeMode="cover"
                />
              )}
              style={styles.imageList}
            />
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            onLike(item?._id);
          }}
        >
          <Text
            style={[
              styles.actionIcon,
              isLiked && styles.likedIcon,
            ]}
          >
            {isLiked ? "❤️" : "🤍"}
          </Text>
          <Text
            style={[
              styles.actionText,
              isLiked && styles.likedText,
            ]}
          >
            {likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            onComment(item?._id);
          }}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>
            {item?.comments?.length || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewPostButton}
          onPress={(e) => {
            e.stopPropagation();
            onViewPost(item?._id);
          }}
        >
          <Text style={styles.viewPostText}>View post</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PostItem;