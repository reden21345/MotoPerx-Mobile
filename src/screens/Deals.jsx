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
import DropDownPicker from "react-native-dropdown-picker";
import { useSelector } from "react-redux";
import DealsComponent from "../components/DealsComponent";

const Deals = () => {
  const { deals, loading } = useSelector((state) => state.deals);
  const { error, message } = useSelector((state) => state.points);

  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState("All");
  const [items, setItems] = useState([
    { label: 'All', value: 'All' },
    { label: 'Bronze', value: 'Bronze' },
    { label: 'Silver', value: 'Silver' },
    { label: 'Gold', value: 'Gold' },
  ]);

  const getTierStyle = (tier) => {
      const isSelected = selectedTier === tier;

      const baseStyle = {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 8,
        backgroundColor: '#d3d3d3', // default gray
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
        <Text style={{ fontWeight: 'bold', marginRight: 10, color: "#fff" }}>TIER:</Text>
        
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
    backgroundColor: "#000000",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#98DB52",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderColor: "#98DB52",
    borderWidth: 2,
    marginBottom: 10,
  },
});

export default Deals;
