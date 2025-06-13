import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import { sendNotifications } from "../../redux/actions/notifAction";

const NotifyUsers = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = () => {
    const data = { title, body, role: "user" };
    dispatch(sendNotifications(data)).then(() => {
      Alert.alert("Notified!", "Announcement is sent to all users");
      setTitle("");
      setBody("");
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>ANNOUNCEMENT</Text>

      <Text style={styles.label}>TITLE</Text>
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>BODY</Text>
      <TextInput
        style={styles.bodyInput}
        value={body}
        onChangeText={setBody}
        placeholder="Enter body"
        placeholderTextColor="#999"
        multiline
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>SEND ANNOUNCEMENT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 4,
  },
  titleInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 24,
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  bodyInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 16,
    height: 180,
    fontSize: 16,
    marginBottom: 32,
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 32,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff",
  },
});

export default NotifyUsers;
