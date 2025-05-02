import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { getAllPartners } from "../../redux/actions/adminAction";
import { clearSuccess } from "../../redux/slices/adminSlice";
import { clearMessage } from "../../redux/slices/partnerSlice";
import DropDownPicker from "react-native-dropdown-picker";
import { updateStatus } from "../../redux/actions/partnerAction";

const Partners = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { partners, loading } = useSelector((state) => state.admins);
  const { message, error } = useSelector((state) => state.partners);

  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getAllPartners());
  }, [dispatch]);

  useEffect(() => {
    if (partners) {
      const uniqueStatuses = ["all", ...new Set(partners.map((p) => p.status))];
      setItems(
        uniqueStatuses.map((status) => ({ label: status, value: status }))
      );
    }
  }, [partners]);

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

  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    dispatch(getAllPartners()).finally(() => setRefreshing(false));
    dispatch(clearSuccess());
    dispatch(clearMessage());
  };

  const handleEdit = (item) => {
    console.log("Partner Edit ", item);
    // navigation.navigate("EditUser", { user: item });
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Partner Deleted ", id);
          },
        },
      ]
    );
  };

  const handleApproval = (id) => {
    Alert.alert(
      "Approval",
      "Do you want to approve this application for partnership?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "No",
          style: "destructive",
          onPress: () => {
            const data = {
              id,
              status: "Disapproved",
            };
            dispatch(updateStatus(data));
          },
        },
        {
          text: "Yes",
          style: "default",
          onPress: () => {
            const data = {
              id,
              status: "Approved",
            };
            dispatch(updateStatus(data));
          },
        },
      ]
    );
  };

  const renderRightActions = (item) => (
    <View style={styles.actionsContainer}>
      {item.status === 'Approved' &&(<TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={() => handleEdit(item)}
      >
        <Ionicons name="pencil" size={20} color="white" />
      </TouchableOpacity>)}
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => handleDelete(item._id)}
      >
        <Ionicons name="trash" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    const createdAt = new Date(item.createdAt).toLocaleDateString();
    const pending = item.status === "Pending";
    return (
      <Swipeable
        renderRightActions={() => (pending ? null : renderRightActions(item))}
      >
        <TouchableOpacity
          style={styles.card}
          disabled={!pending}
          onPress={() => handleApproval(item._id)}
        >
          {item.avatar?.url ? (
            <Image source={{ uri: item.avatar.url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{item.storeName[0]}</Text>
            </View>
          )}
          <View style={styles.info}>
            <Text style={styles.name}>Owner: {item.owner.name}</Text>
            <Text style={styles.name}>Store: {item.storeName}</Text>
            <Text style={styles.email}>Address: {item.location}</Text>
            <Text style={styles.role}>Status: {item.status}</Text>
            {item.status === "Pending" ? (
              <Text style={styles.created}>Created At: {createdAt}</Text>
            ) : item.status === "Disapproved" ? (
              <Text style={styles.created}>Declined: {createdAt}</Text>
            ) : (
              <Text style={styles.created}>Joined: {createdAt}</Text>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.screenTitle}>All Partners</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search (owner, store name, location)"
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
        data={filteredPartners}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  role: {
    fontSize: 14,
    color: "#007bff",
    marginTop: 2,
  },
  created: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
    overflow: "hidden",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
});

export default Partners;
