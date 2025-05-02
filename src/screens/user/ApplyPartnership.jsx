import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { apply, getPartner } from "../../redux/actions/partnerAction";
import { clearMessage } from "../../redux/slices/partnerSlice";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const ApplyPartnership = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { partner, message, error, loading } = useSelector(
    (state) => state.partners
  );

  useEffect(() => {
    if (user?.role === "partner" || user?.role === "employee") {
      dispatch(getPartner());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (message) {
      Alert.alert("Success", `${message}`);
    }
  }, [message]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        dispatch(clearMessage());
      };
    }, [dispatch])
  );

  const [storeName, setStoreName] = useState("");
  const [location, setLocation] = useState("");
  const [conversion, setConversion] = useState("");
  const [avatar, setAvatar] = useState(null);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#424242" />
      </View>
    );
  }

  if (error) {
    Alert.alert("Error", error);
  }

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access gallery is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];

      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const base64Image = `data:image/jpeg;base64,${base64}`;
      setAvatar(base64Image);
    }
  };

  const handleApply = () => {
    const data = {
      storeName,
      location,
      conversion: Number(conversion),
      avatar
    };

    dispatch(apply(data));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.outerContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.screenTitle}>Partner Application</Text>
        {!partner ? (
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Store Name"
              value={storeName}
              onChangeText={setStoreName}
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Store Address"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Transaction Amount"
              keyboardType="numeric"
              value={conversion}
              onChangeText={setConversion}
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity onPress={pickAvatar} style={styles.avatarPicker}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>Add Logo</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={handleApply}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        ) : partner && partner.status === "Pending" ? (
          <View style={styles.pendingContainer}>
            <Text style={styles.pendingText}>Waiting for approval...</Text>
          </View>
        ) : partner && partner.status === "Disapproved" ? (
          <View style={styles.pendingContainer}>
            <Text style={styles.pendingText}>
              Sorry your application has been declined
            </Text>
          </View>
        ) : (
          <View style={styles.pendingContainer}>
            <Text style={styles.pendingText}>Styled Partner</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#424242",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fafafa",
  },
  submitButton: {
    backgroundColor: "#424242",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  pendingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pendingText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#424242",
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
  avatarText: {
    color: "#888",
    textAlign: "center",
  },
});

export default ApplyPartnership;
