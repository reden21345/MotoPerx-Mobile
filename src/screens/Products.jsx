import React, { useState } from "react";
import {
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  RefreshControl,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../redux/actions/productAction";
import ProductCard from "../components/ProductCard";

const Products = ({ navigation }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState(null);


  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  if (error) {
    Alert.alert("Error", error);
  }

  const allProducts = products?.flatMap((store) =>
    store.productService.map((service) => ({ ...service }))
  );

  const filteredProducts = allProducts?.filter((prod) => {
    const matchesSearch = prod.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      !filter || (filter === "service"
        ? prod.types?.toLowerCase() === "services"
        : prod.types?.toLowerCase() === "products");

    return matchesSearch && matchesFilter;
  });


  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getAllProducts()).finally(() => setRefreshing(false));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#98DB52" />
      </TouchableOpacity>

      <Text style={styles.screenTitle}>PRODUCTS / SERVICES</Text>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={20} color="#000" style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, { color: "#FFF" }]}
          placeholder="Search by name"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterWrapper}>
        <Text style={styles.filterLabel}>FILTER BY</Text>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "service" && styles.activeFilter,
          ]}
          onPress={() =>
            setFilter((prev) => (prev === "service" ? null : "service"))
          }
        >
          <Ionicons name="construct-outline" size={16} color="#000" />
          <Text style={styles.filterText}> Services</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "product" && styles.activeFilter,
          ]}
          onPress={() =>
            setFilter((prev) => (prev === "product" ? null : "product"))
          }
        >
          <Ionicons name="cube-outline" size={16} color="#000" />
          <Text style={styles.filterText}> Products</Text>
        </TouchableOpacity>

      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <ProductCard item={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: "#000000",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#98DB52",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 15,
    borderColor: "#98DB52",
    borderWidth: 1,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    color: "#fff"
  },
  filterWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    flexWrap: "wrap",
  },
  filterLabel: {
    marginRight: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginRight: 10,
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  activeFilter: {
    backgroundColor: "#98DB52",
  },
  filterText: {
    fontSize: 14,
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});

export default Products;
