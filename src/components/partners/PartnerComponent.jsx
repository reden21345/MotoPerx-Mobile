import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Swipeable } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native'
import Ionicons from "react-native-vector-icons/Ionicons";
import { updateStatus } from "../../redux/actions/partnerAction";
import * as Location from "expo-location";

const PartnerItem = ({ item }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const createdAt = new Date(item.createdAt).toLocaleDateString();
  const pending = item.status === "Pending";
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const getAddress = async () => {
      // ✅ Request foreground location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        setAddress("Permission denied");
        return;
      }

      const region = {
        latitude: item.location.coordinates[1],
        longitude: item.location.coordinates[0],
      };

      try {
        const response = await Location.reverseGeocodeAsync(region);
        if (response && response.length > 0) {
          console.log(response[0])
          const { formattedAddress } = response[0];
          setAddress(`${formattedAddress}`);
        }
      } catch (error) {
        console.warn("Failed to reverse geocode:", error);
        setAddress("Unknown");
      }
    };

    getAddress();
  }, [item.location.coordinates]);

  const handleEdit = () => {
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

  const handleDetails = () => {
    Alert.alert(
      "See Details",
      "Do you want to see more details?",
      [
        { text: "No", style: "cancel" },
        { text: "", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => navigation.navigate("PartnerDetails", {item}),
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

  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      {item.status === "Approved" && (
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit()}
        >
          <Ionicons name="pencil" size={20} color="white" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => handleDelete(item._id)}
      >
        <Ionicons name="trash" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable
      renderRightActions={() => (pending ? null : renderRightActions())}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => {pending ? handleApproval(item._id) : handleDetails()}}
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
          <Text style={styles.email}>Address: {address || "Loading..."}</Text>
          <Text style={styles.role}>Status: {item.status}</Text>
          <Text style={styles.created}>
            {item.status === "Pending"
              ? `Created At: ${createdAt}`
              : item.status === "Disapproved"
              ? `Declined: ${createdAt}`
              : `Joined: ${createdAt}`}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
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

export default PartnerItem;
