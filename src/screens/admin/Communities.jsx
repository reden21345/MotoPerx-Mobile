import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getAllCommunities } from "../../redux/actions/adminAction";
import { clearSuccess } from "../../redux/slices/adminSlice";
import { clearMessage } from "../../redux/slices/communitySlice";
import DropDownPicker from "react-native-dropdown-picker";
import CommunityItem from "../../components/communities/CommunityItem";

const Communities = () => {
  const dispatch = useDispatch();
  const { communities, loading } = useSelector((state) => state.admins);
  const { message, error } = useSelector((state) => state.communities);

  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getAllCommunities());
  }, [dispatch]);

  useEffect(() => {
    if (communities) {
      const uniqueStatuses = ["all", ...new Set(communities.map((c) => c.status))];
      setItems(
        uniqueStatuses.map((status) => ({ label: status, value: status }))
      );
    }
  }, [communities]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        dispatch(clearMessage());
        dispatch(clearSuccess());
      };
    }, [dispatch])
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  if (error) {
    Alert.alert("Error", error);
  }

  if (message) {
    Alert.alert("Message", message);
  }

  const filteredCommunities = communities.filter((c) => {
    const matchesSearch =
      c.creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getAllCommunities()).finally(() => setRefreshing(false));
    dispatch(clearSuccess());
    dispatch(clearMessage());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.screenTitle}>All Communities</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search (creator name, community name)"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <DropDownPicker
        open={open}
        value={selectedStatus}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedStatus}
        setItems={setItems}
        placeholder="Filter by status"
        containerStyle={{ marginBottom: open ? 200 : 15, zIndex: 1000 }}
        zIndex={1000}
      />

      <FlatList
        data={filteredCommunities}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CommunityItem
            item={item}
          />
        )}
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
    paddingHorizontal: 10,
    backgroundColor: "#fff",
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
    borderColor: "#000",
    borderWidth: 1,
    marginBottom: 10,
  },
  list: {
    paddingBottom: 20,
  },
});

export default Communities;
