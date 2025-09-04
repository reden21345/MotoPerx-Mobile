import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { postItemStyles } from "../../styles/PostItemStyles";

const PostItem = ({
  item,
  user,
  likedPosts,
  activeDropdown,
  onLike,
  onComment,
  onShare,
  onToggleDropdown,
  onEdit,
  onDelete,
  onReport,
  onCloseDropdown,
}) => {
  const isLiked = likedPosts.has(item._id);
  const likesCount = (item.likes?.length || 0) + (isLiked ? 1 : 0);
  const isOwner =
    String(user._id) === String(item.createdBy?._id || item.createdBy);
  const showDropdown = activeDropdown === item._id;

  return (
    <View style={postItemStyles.postContainer}>
      <View style={postItemStyles.postHeader}>
        <View style={postItemStyles.userInfo}>
          <View style={postItemStyles.avatar}>
            <Text style={postItemStyles.avatarText}>
              {item.createdBy?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <View style={postItemStyles.userDetails}>
            <Text style={postItemStyles.name}>
              {item.createdBy?.name || "Anonymous"}
            </Text>
            {item.isCommunity && item.communityName && (
              <Text style={postItemStyles.communityName}>
                in {item.communityName}
              </Text>
            )}
            <Text style={postItemStyles.timestamp}>2h ago</Text>
          </View>
        </View>
        <TouchableOpacity
          style={postItemStyles.moreButton}
          onPress={() => onToggleDropdown(item._id)}
        >
          <Text style={postItemStyles.moreText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          <TouchableOpacity
            style={postItemStyles.dropdownOverlay}
            onPress={onCloseDropdown}
            activeOpacity={1}
          />
          <View style={postItemStyles.dropdownMenu}>
            {isOwner ? (
              <>
                <TouchableOpacity
                  style={postItemStyles.dropdownItem}
                  onPress={() => onEdit(item._id)}
                >
                  <Text style={postItemStyles.dropdownIcon}>✏️</Text>
                  <Text style={postItemStyles.dropdownText}>Edit Post</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    postItemStyles.dropdownItem,
                    postItemStyles.deleteItem,
                  ]}
                  onPress={() => onDelete(item._id)}
                >
                  <Text style={postItemStyles.dropdownIcon}>🗑️</Text>
                  <Text
                    style={[
                      postItemStyles.dropdownText,
                      postItemStyles.deleteText,
                    ]}
                  >
                    Delete Post
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={postItemStyles.dropdownItem}
                onPress={() => onReport(item._id)}
              >
                <Text style={postItemStyles.dropdownIcon}>🚨</Text>
                <Text style={postItemStyles.dropdownText}>Report Post</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

      {/* Post Content */}
      <View style={postItemStyles.postContent}>
        {item.title && (
          <Text style={postItemStyles.postTitle}>{item.title}</Text>
        )}
        <Text style={postItemStyles.postCaption}>{item.caption}</Text>
      </View>

      {/* Images */}
      {item.images?.length > 0 && (
        <View style={postItemStyles.imageContainer}>
          {item.images.length === 1 ? (
            <Image
              source={{ uri: item.images[0].url }}
              style={postItemStyles.singleImage}
              resizeMode="cover"
            />
          ) : (
            <FlatList
              data={item.images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(img, index) => index.toString()}
              renderItem={({ item: img }) => (
                <Image
                  source={{ uri: img.url }}
                  style={postItemStyles.multipleImage}
                  resizeMode="cover"
                />
              )}
              style={postItemStyles.imageList}
            />
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={postItemStyles.actionBar}>
        <TouchableOpacity
          style={postItemStyles.actionButton}
          onPress={() => onLike(item._id)}
        >
          <Text
            style={[
              postItemStyles.actionIcon,
              isLiked && postItemStyles.likedIcon,
            ]}
          >
            {isLiked ? "❤️" : "🤍"}
          </Text>
          <Text
            style={[
              postItemStyles.actionText,
              isLiked && postItemStyles.likedText,
            ]}
          >
            {likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={postItemStyles.actionButton}
          onPress={() => onComment(item._id)}
        >
          <Text style={postItemStyles.actionIcon}>💬</Text>
          <Text style={postItemStyles.actionText}>
            {item.comments?.length || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={postItemStyles.actionButton}
          onPress={() => onShare(item._id)}
        >
          <Text style={postItemStyles.actionIcon}>📤</Text>
          <Text style={postItemStyles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostItem;
