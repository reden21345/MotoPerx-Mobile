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
import DropDownPicker from "react-native-dropdown-picker";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../redux/actions/productAction";
import ProductCard from "../components/ProductCard";
import { PRODUCT_OPTIONS, SERVICE_OPTIONS } from "../utils/constants";

const Products = ({ navigation }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState(null);

  const [typeOpen, setTypeOpen] = useState(false);
  const [typeValue, setTypeValue] = useState(null);
  const [typeItems, setTypeItems] = useState([]);

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
      !filter ||
      (filter === "services"
        ? prod.info?.category?.toLowerCase() === "services"
        : prod.info?.category?.toLowerCase() === "products");

    const matchesType =
      !typeValue ||
      (filter === "products"
        ? prod.info?.productType === typeValue
        : prod.info?.serviceType === typeValue);

    return matchesSearch && matchesFilter && matchesType;
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#98DB52" />
      </TouchableOpacity>

      <Text style={styles.screenTitle}>PRODUCTS / SERVICES</Text>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search"
          size={20}
          color="#000"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={[styles.searchInput, { color: "#000" }]}
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
            filter === "services" && styles.activeFilter,
          ]}
          onPress={() => {
            setTypeValue(null);
            setFilter((prev) => (prev === "services" ? null : "services"));
          }}
        >
          <Ionicons name="construct-outline" size={16} color="#000" />
          <Text style={styles.filterText}> Services</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "products" && styles.activeFilter,
          ]}
          onPress={() => {
            setTypeValue(null);
            setFilter((prev) => (prev === "products" ? null : "products"));
          }}
        >
          <Ionicons name="cube-outline" size={16} color="#000" />
          <Text style={styles.filterText}> Products</Text>
        </TouchableOpacity>
      </View>

      {filter && (
        <DropDownPicker
          open={typeOpen}
          value={typeValue}
          items={filter === "products" ? PRODUCT_OPTIONS : SERVICE_OPTIONS}
          setOpen={setTypeOpen}
          setValue={setTypeValue}
          setItems={setTypeItems}
          placeholder={`Select ${
            filter === "products" ? "Product" : "Service"
          } Type`}
          searchable={true}
          searchPlaceholder="Search type..."
          style={{
            marginBottom: 10,
            zIndex: 1000,
            borderColor: "#000",
          }}
          dropDownContainerStyle={{ zIndex: 999 }}
          listMode="SCROLLVIEW"
          nestedScrollEnabled={true}
        />
      )}

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <ProductCard item={item} compact />}
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
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "#000",
    borderRadius: 5,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 15,
    borderColor: "#000",
    borderWidth: 1,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    color: "#fff",
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
    color: "#000",
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
    borderColor: "#000",
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
