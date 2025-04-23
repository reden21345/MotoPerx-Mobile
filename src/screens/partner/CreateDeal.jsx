import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { useDispatch, useSelector } from "react-redux";
import { createDeals } from "../../redux/actions/dealsAction";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

const CreateDeal = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { partner } = useSelector((state) => state.partners);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [redemptionPoints, setRedemptionPoints] = useState("");
  const [images, setImages] = useState([]);

  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Product", value: "Product" },
    { label: "Service", value: "Service" },
  ]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant camera roll permissions to upload images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const base64Images = await Promise.all(
        result.assets.map(async (asset) => {
          const base64 = await FileSystem.readAsStringAsync(asset.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          return `data:image/jpeg;base64,${base64}`;
        })
      );

      setImages((prevImages) => [...prevImages, ...base64Images]);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  const handleSubmit = () => {
    if (
      !title ||
      !description ||
      !discount ||
      !expiryDate ||
      !category ||
      !redemptionPoints
    ) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    const data = {
      partner: partner._id,
      title,
      description,
      discount: Number(discount),
      expiryDate,
      redemptionPoints,
      category,
      createdBy: user?._id,
      images,
    };

    dispatch(createDeals(data))
      .then(() => {
        Alert.alert("Success", "Deal added successfully!");
        navigation.goBack();
      })
      .catch((err) => Alert.alert("Error", err.message));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <SafeAreaView style={styles.form}>
          <Text style={styles.screenTitle}>Add Deal</Text>

          <TextInput
            style={styles.input}
            placeholder="Deal title"
            value={title}
            onChangeText={setTitle}
          />

          <DropDownPicker
            open={open}
            value={category}
            items={items}
            setOpen={setOpen}
            setValue={setCategory}
            setItems={setItems}
            placeholder="Select category type"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />

          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            multiline={true}
            onChangeText={setDescription}
          />

          <TextInput
            style={styles.input}
            placeholder="Discount (%)"
            keyboardType="numeric"
            value={discount}
            onChangeText={setDiscount}
          />

          <TextInput
            style={styles.input}
            placeholder="Redemption points"
            keyboardType="numeric"
            value={redemptionPoints}
            onChangeText={setRedemptionPoints}
          />

          {/* Expiry Date Picker */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              Expiry Date: {formatDate(expiryDate)}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={expiryDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {/* Image Upload Button */}
          <TouchableOpacity
            style={styles.imageButton}
            onPress={handlePickImage}
          >
            <Text style={styles.imageButtonText}>
              <Ionicons name="images-sharp" size={30} color={"#000"} />
            </Text>
          </TouchableOpacity>

          {/* Display Selected Images */}
          {images.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    key={index}
                    source={{ uri }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Text style={styles.removeImageText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Add Deal</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </View>
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
    marginVertical: 16,
  },
  form: {
    flex: 1,
    paddingHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  imageButton: {
    alignSelf: "center",
    marginBottom: 20,
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: "#000",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 4,
  },
  imageWrapper: {
    position: "relative",
    margin: 4,
  },
  removeImageButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgb(255, 255, 255)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  removeImageText: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  datePickerText: {
    color: "#000",
  },
});

export default CreateDeal;
