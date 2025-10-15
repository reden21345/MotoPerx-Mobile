import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { communitySelection as styles } from "../../styles/CommunitySelection";

const CommunitySelection = ({
  visible,
  onClose,
  communities,
  joinedCommunities,
  createdCommunities,
  selectedCommunity,
  onSelectCommunity,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter to show only joined and created communities
  const availableCommunities = useMemo(() => {
    const communityIds = [
      ...new Set([...joinedCommunities, ...createdCommunities]),
    ];
    return communities.filter((community) =>
      communityIds.includes(community._id)
    );
  }, [communities, joinedCommunities, createdCommunities]);

  // Filter communities based on search query
  const filteredCommunities = useMemo(() => {
    if (!searchQuery.trim()) return availableCommunities;
    
    const query = searchQuery.toLowerCase();
    return availableCommunities.filter(
      (community) =>
        community.name.toLowerCase().includes(query) ||
        community.description?.toLowerCase().includes(query)
    );
  }, [availableCommunities, searchQuery]);

  const handleSelect = (community) => {
    onSelectCommunity(community);
    setSearchQuery("");
    onClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  const renderCommunityItem = ({ item }) => {
    const isSelected = selectedCommunity?._id === item._id;
    
    return (
      <TouchableOpacity
        style={[styles.communityItem, isSelected && styles.selectedItem]}
        onPress={() => handleSelect(item)}
      >
        <View style={styles.communityInfo}>
          <Text style={styles.communityName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.communityDescription} numberOfLines={1}>
              {item.description}
            </Text>
          )}
          <View style={styles.communityMeta}>
            <Text style={styles.metaText}>
              {item.members?.length || 0} members
            </Text>
            {item.isPrivate && (
              <>
                <Text style={styles.metaDivider}>•</Text>
                <Ionicons name="lock-closed" size={12} color="#657786" />
                <Text style={styles.metaText}>Private</Text>
              </>
            )}
          </View>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#1DA1F2" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1}
          onPress={handleClose}
        >
          <TouchableOpacity 
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <SafeAreaView style={styles.safeArea}>
              {/* Drag Handle */}
              <View style={styles.dragHandle} />

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Select Community</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#657786" />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#657786" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search communities..."
                  placeholderTextColor="#657786"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons name="close-circle" size={20} color="#657786" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Communities List */}
              {filteredCommunities.length > 0 ? (
                <FlatList
                  data={filteredCommunities}
                  renderItem={renderCommunityItem}
                  keyExtractor={(item) => item._id}
                  style={styles.list}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="people-outline" size={48} color="#657786" />
                  <Text style={styles.emptyText}>
                    {searchQuery.trim()
                      ? "No communities found"
                      : "You haven't joined any communities yet"}
                  </Text>
                </View>
              )}
            </SafeAreaView>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommunitySelection;