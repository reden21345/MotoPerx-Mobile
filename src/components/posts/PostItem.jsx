import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { postItemStyles as styles } from "../../styles/PostItemStyles";
import { useSelector } from "react-redux";
import { formatDateWithAgo } from "../../utils/helpers";
import DropdownAction from "../../components/DropdownAction";

const PostItem = ({
  item,
  user,
  likedPosts,
  localLikeCounts,
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
  const likesCount = localLikeCounts[item?._id] ?? (item?.likes?.length || 0);
  const { communities } = useSelector((state) => state.communities);

  const isOwner =
    String(user?._id) === String(item?.createdBy?._id || item?.createdBy);
  const showDropdown = activeDropdown === item?._id;

  const handlePostPress = () => {
    if (showDropdown) {
      onCloseDropdown();
    }
  };

  const community =
    item?.postType === "community"
      ? communities.find(
          (comm) =>
            String(comm._id) === String(item.community || item.communityId)
        )
      : null;

  return (
    <TouchableOpacity
      style={styles.postContainer}
      activeOpacity={1}
      onPress={handlePostPress}
    >
      {item?.postType === "community" && community && (
        <Text style={[styles.communityName, { color: "#1DA1F2" }]}>
          in {community.name}
        </Text>
      )}
      {item?.postType === "admin" && (
        <Text
          style={[
            styles.communityName,
            styles.adminBadge,
            { color: "#e63946" },
          ]}
        >
          Admin Post
        </Text>
      )}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            {item?.createdBy?.avatar?.url ? (
              <Image
                source={{ uri: item?.createdBy?.avatar?.url }}
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
              {item?.postType === "admin" ? "Admin" : item?.createdBy?.name}
            </Text>

            <Text style={styles.timestamp}>
              {formatDateWithAgo(item?.createdAt)}
            </Text>
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
      <DropdownAction
        visible={showDropdown}
        isOwner={isOwner}
        onEdit={() => onEdit(item)}
        onDelete={() => onDelete(item?._id)}
        onReport={() => onReport(item?._id)}
      />

      {/* Post Content */}
      <View style={styles.postContent}>
        {item?.title && <Text style={styles.postTitle}>{item?.title}</Text>}
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
          <Text style={[styles.actionIcon, isLiked && styles.likedIcon]}>
            {isLiked ? "❤️" : "🤍"}
          </Text>
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {likesCount}
          </Text>
        </TouchableOpacity>

        {item?.postType === "community" && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onComment(item?._id);
            }}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>{item?.comments?.length || 0}</Text>
          </TouchableOpacity>
        )}

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
