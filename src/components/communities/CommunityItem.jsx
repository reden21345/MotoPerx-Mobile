import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { Swipeable } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { updateStatus } from "../../redux/actions/communityAction";
import { getStatusStyle } from "../../utils/helpers";
import {
  deletePartner,
  getAllCommunities,
} from "../../redux/actions/adminAction";
import { sendSingleUserNotif } from "../../redux/actions/notifAction";
import { clearMessage } from "../../redux/slices/communitySlice";

const CommunityItem = ({ item }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const createdAt = new Date(item.createdAt).toLocaleDateString() || null;
  const pending = item.status === "Pending" || null;

  const handleEdit = () => {
    navigation.navigate("EditPartner", { partner: item, admin: true });
  };

  const handleCommunityStatus = async (stat) => {
    const data = {
      id: item._id,
      status: stat ? "Approved" : "Disapproved",
    };

    const notifData = {
      title: "Community update",
      body: stat
        ? "Congratulations! Your application of community creation is approved"
        : "We are sorry to inform you that your application of community creation is disapproved",
      userId: item.creator?._id,
    };

    try {
      const resultAction = await dispatch(updateStatus(data));

      if (updateStatus.fulfilled.match(resultAction)) {
        dispatch(sendSingleUserNotif(notifData));
        dispatch(clearMessage());
        dispatch(getAllCommunities());
      } else {
        Alert.alert(
          "Update Failed",
          resultAction.payload || "Failed to update community status."
        );
      }
    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // try {
            //   const resultAction = await dispatch(deletePartner(id));

            //   if (deletePartner.fulfilled.match(resultAction)) {
            //     Alert.alert("Success", "Partner store deleted successfully");
            //     dispatch(getAllPartners());
            //   } else {
            //     Alert.alert(
            //       "Deletion Failed",
            //       resultAction.payload || "Something went wrong."
            //     );
            //   }
            // } catch (err) {
            //   Alert.alert(
            //     "Deletion Failed",
            //     err.message || "Something went wrong."
            //   );
            // }
            console.log("Delete community with id:", id);
          },
        },
      ]
    );
  };

  const handleApproval = () => {
    Alert.alert(
      "Approval",
      "Do you want to approve this community application?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "No",
          style: "destructive",
          onPress: () => handleCommunityStatus(false),
        },
        {
          text: "Yes",
          style: "default",
          onPress: () => handleCommunityStatus(true),
        },
      ]
    );
  };

  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      {item.status !== "Disapproved" && (
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => (pending ? handleApproval() : handleEdit())}
        >
          <Ionicons
            name={pending ? "checkmark" : "pencil"}
            size={20}
            color="white"
          />
        </TouchableOpacity>
      )}
      {(item.status === "Approved" || item.status === "Disapproved") && (
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item._id)}
        >
          <Ionicons name="trash" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Swipeable renderRightActions={() => renderRightActions()}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => console.log("Community pressed: ", item)}
      >
        {item.avatar?.url ? (
          <Image source={{ uri: item.avatar.url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.name[0]}</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>Creator: {item.creator?.name}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={[styles.role, getStatusStyle(item.status)]}>
            Status: {item.status}
          </Text>
          <Text style={styles.created}>
            {item.status === "Pending"
              ? `Created At: ${createdAt}`
              : item.status === "Disapproved"
              ? `Declined: ${createdAt}`
              : `Approved: ${createdAt}`}
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
    borderWidth: 2,
    borderColor: "#000",
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
    borderWidth: 2,
    borderColor: "#000",
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
    color: "#000",
  },
  email: {
    fontSize: 10,
    color: "#000",
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

export default CommunityItem;
