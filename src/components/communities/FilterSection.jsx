import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { communitiesStyles as styles } from "../../styles/CommunitiesStyles";

const FilterSection = ({
  navigation,
  setSearchQuery,
  searchQuery,
  setPrivacyFilter,
  privacyFilter,
}) => {

  return (
    <View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search communities..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("CreateCommunity")}
          activeOpacity={0.7}
        >
          <Text style={styles.createButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Privacy Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            privacyFilter === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setPrivacyFilter("all")}
        >
          <Text
            style={[
              styles.filterButtonText,
              privacyFilter === "all" && styles.filterButtonTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            privacyFilter === "public" && styles.filterButtonActive,
          ]}
          onPress={() => setPrivacyFilter("public")}
        >
          <Text
            style={[
              styles.filterButtonText,
              privacyFilter === "public" && styles.filterButtonTextActive,
            ]}
          >
            🌐 Public
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            privacyFilter === "private" && styles.filterButtonActive,
          ]}
          onPress={() => setPrivacyFilter("private")}
        >
          <Text
            style={[
              styles.filterButtonText,
              privacyFilter === "private" && styles.filterButtonTextActive,
            ]}
          >
            🔒 Private
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilterSection;
