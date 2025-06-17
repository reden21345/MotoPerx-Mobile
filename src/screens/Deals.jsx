import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import DealsComponent from "../components/DealsComponent";

const Deals = () => {
  const { deals, loading } = useSelector((state) => state.deals);
  const { error, message } = useSelector((state) => state.points);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState("All");

  const getTierStyle = (tier) => {
      const isSelected = selectedTier === tier;

      const baseStyle = {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 8,
        backgroundColor: '#fff', // default gray
        borderWidth: 1,
        borderColor: '#000', // black border
      };

      if (isSelected) {
        switch (tier) {
          case 'Gold':
            baseStyle.backgroundColor = '#FFD700';
            break;
          case 'Silver':
            baseStyle.backgroundColor = '#C0C0C0';
            break;
          case 'Bronze':
            baseStyle.backgroundColor = '#CD7F32';
            break;
          default:
            break;
        }
      }

      return baseStyle;
    };



  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  if (error) {
    Alert.alert("Failed", error);
  }

  if (message) {
    Alert.alert("Success", message);
  }

  const filteredDeals = deals
    .filter((deal) => deal.status === "Available")
    .filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = selectedTier === "All" || d.tier === selectedTier;
      return matchesSearch && matchesTier;
    });

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Available Deals</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontWeight: 'bold', marginRight: 10, color: "#000" }}>TIER:</Text>
        
        {['Gold', 'Silver', 'Bronze'].map((tier) => (
          <TouchableOpacity
            key={tier}
            onPress={() => {
              setSelectedTier((prev) => (prev === tier ? "All" : tier));
            }}
          >
            <View style={getTierStyle(tier)}>
              <Text style={{ fontWeight: 'bold' }}>{tier.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>

        ))}
      </View>


      <DealsComponent dealsData={filteredDeals} partner={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  searchInput: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 15,
    borderColor: "#000",
    borderWidth: 1,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  }

});

export default Deals;
