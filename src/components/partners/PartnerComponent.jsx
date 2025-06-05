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
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { updateStatus } from "../../redux/actions/partnerAction";
import { getAddress } from "../../utils/helpers";
import { deletePartner, getAllPartners } from "../../redux/actions/adminAction";
import { sendSingleUserNotif } from "../../redux/actions/notifAction";

const PartnerItem = ({ item, admin, setComp, setItem }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const createdAt = new Date(item.createdAt).toLocaleDateString() || null;
  const pending = item.status === "Pending" || null;
  const [address, setAddress] = useState(null);

  useEffect(() => {
    getAddress(item?.location?.coordinates, setAddress);
  }, [item.location.coordinates]);

  const handleEdit = () => {
    navigation.navigate("EditPartner", { partner: item, admin: true });
  };

  const handlePartnerStatus = (stat) => {
    const data = {
      id: item._id,
      status: stat ? "Approved" : "Disapproved",
    };

    const notifData = {
      title: "Partnership update",
      body: stat
        ? "Congratulations! Your application of partnership is approved"
        : "We are sorry to inform you that your application of partnership is disapproved",
      userId: item.owner?._id,
    };
    dispatch(updateStatus(data)).then(() => {
      dispatch(sendSingleUserNotif(notifData));
      dispatch(getAllPartners());
    });
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
            try {
              const resultAction = await dispatch(deletePartner(id));

              if (deletePartner.fulfilled.match(resultAction)) {
                Alert.alert("Success", "Partner store deleted successfully");

                // Optionally, re-fetch partner list
                dispatch(getAllPartners());
              } else {
                Alert.alert(
                  "Deletion Failed",
                  resultAction.payload || "Something went wrong."
                );
              }
            } catch (err) {
              Alert.alert(
                "Deletion Failed",
                err.message || "Something went wrong."
              );
            }
          },
        },
      ]
    );
  };

  const handleDetails = () => {
    setComp("PartnerDetails");
    setItem(item);
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
          onPress: () => handlePartnerStatus(false),
        },
        {
          text: "Yes",
          style: "default",
          onPress: () => handlePartnerStatus(true),
        },
      ]
    );
  };

  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      {item.status !== "Disapproved" && (
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => (pending ? handleApproval(item._id) : handleEdit())}
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
    <Swipeable renderRightActions={() => (admin ? renderRightActions() : null)}>
      <TouchableOpacity style={styles.card} onPress={() => handleDetails()}>
        {item.avatar?.url ? (
          <Image source={{ uri: item.avatar.url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.storeName[0]}</Text>
          </View>
        )}
        <View style={styles.info}>
          {admin && <Text style={styles.name}>Owner: {item.owner.name}</Text>}
          <Text style={styles.name}>{item.storeName}</Text>
          <Text style={styles.email}>Address: {address || "Loading..."}</Text>
          {admin && (
            <>
              <Text style={styles.role}>Status: {item.status}</Text>
              <Text style={styles.created}>
                {item.status === "Pending"
                  ? `Created At: ${createdAt}`
                  : item.status === "Disapproved"
                  ? `Declined: ${createdAt}`
                  : `Joined: ${createdAt}`}
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#98DB52",
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
    borderColor: "#98DB52",
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
    color: "#98DB52",
  },
  email: {
    fontSize: 10,
    color: "#98DB52",
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
