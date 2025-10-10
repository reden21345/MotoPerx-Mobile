import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { communityDetailStyles as styles } from "../../styles/CommunityDetails";

const CommunityTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: "posts", label: "Posts" },
    { key: "members", label: "Members" },
    { key: "about", label: "About" },
  ];

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => onTabChange(tab.key)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CommunityTabs;