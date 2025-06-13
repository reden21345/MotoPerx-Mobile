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
import { getAllUsers, deleteUser } from "../../redux/actions/adminAction";
import { clearSuccess } from "../../redux/slices/adminSlice";
import DropDownPicker from "react-native-dropdown-picker";

const Users = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { users, loading, error } = useSelector((state) => state.admins);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("all");
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin'){
      dispatch(getAllUsers());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (users) {
      const uniqueRoles = ["all", ...new Set(users.map((u) => u.role))];
      setItems(uniqueRoles.map((role) => ({ label: role, value: role })));
    }
  }, [users]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  if (error) {
    Alert.alert("Error", error);
  }

  const filteredUsers = users
    ?.filter((u) => u._id !== user?._id)
    .filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === "all" || u.role === selectedRole;
      return matchesSearch && matchesRole;
    });

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getAllUsers()).finally(() => setRefreshing(false));
    dispatch(clearSuccess())
  };

  const handleEdit = (item) => {
    navigation.navigate("EditUser", { user: item });
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
            dispatch(deleteUser(id))
              .then(Alert.alert("Deleted", "User deleted successfully."))
              .catch((err) => Alert.alert("Error", err.message));
          },
        },
      ]
    );
  };

  const renderRightActions = (item) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={() => handleEdit(item)}
      >
        <Ionicons name="pencil" size={20} color="white" />
      </TouchableOpacity>
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
    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <View style={styles.card}>
          {item.avatar?.url ? (
            <Image source={{ uri: item.avatar.url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{item.name[0]}</Text>
            </View>
          )}
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.role}>Role: {item.role}</Text>
            <Text style={styles.created}>Joined: {createdAt}</Text>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.screenTitle}>All Users</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or email"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <DropDownPicker
        open={open}
        value={selectedRole}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedRole}
        setItems={setItems}
        placeholder="Filter by role"
        containerStyle={{ marginBottom: open ? 200 : 15, zIndex: 1000 }}
        zIndex={1000}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
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
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 10,
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

export default Users;
