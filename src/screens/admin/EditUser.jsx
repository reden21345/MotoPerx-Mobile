import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";
import { editUser } from "../../redux/actions/adminAction";

const EditUser = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { user } = route.params;
  const { error } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar?.url || null);

  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user?.role || null);
  const [items, setItems] = useState([
    { label: "user", value: "user" },
    { label: "partner", value: "partner" },
    { label: "admin", value: "admin" },
  ]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  const handleSubmit = () => {
    const data = {
      id: user._id,
      name,
      email,
      phone,
      role: selectedRole,
    };

    dispatch(editUser(data)).then(() => {
      Alert.alert("Success", "Profile updated successfully");
      navigation.goBack();
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit User</Text>

      {avatar ? (
        <View style={styles.avatarPicker}>
          <Image source={{ uri: avatar }} style={styles.avatarImage} />
        </View>
      ) : (
        <Ionicons
          name="person-circle"
          size={100}
          color="#ccc"
          style={styles.iconPlaceholder}
        />
      )}

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone"
        keyboardType="phone-pad"
      />

      <DropDownPicker
        open={open}
        value={selectedRole}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedRole}
        setItems={setItems}
        placeholder="Select Role"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={1000}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#007bff",
  },
  avatarPicker: {
    alignSelf: "center",
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  iconPlaceholder: {
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
});

export default EditUser;
