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
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { useDispatch, useSelector } from "react-redux";
import { createDeals } from "../../redux/actions/dealsAction";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { handlePickImages, formatDate, handleRemoveImage } from "../../utils/helpers";

const CreateDeal = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { partner } = useSelector((state) => state.partners);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [redemptionPoints, setRedemptionPoints] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Product", value: "Product" },
    { label: "Service", value: "Service" },
  ]);

  const [tier, setTier] = useState(null);
  const [open2, setOpen2] = useState(false);
  const [items2, setItems2] = useState([
    { label: "Bronze", value: "Bronze" },
    { label: "Silver", value: "Silver" },
    { label: "Gold", value: "Gold" },
  ]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      !discount ||
      !expiryDate ||
      !category ||
      !tier ||
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
      tier,
      createdBy: user?._id,
      images,
    };

    try {
      setIsSubmitting(true);
      await dispatch(createDeals(data)).unwrap();
      Alert.alert("Success", "Deal added successfully!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Create Failed", err || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.header}>ADD DEAL</Text>

        <View style={styles.topSection}>
          <TouchableOpacity
            style={styles.avatarBox}
            onPress={() => handlePickImages(setImages)}
          >
            {images[0] ? (
              <Image source={{ uri: images[0] }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>AVATAR</Text>
            )}
          </TouchableOpacity>

          <View style={styles.rightSection}>
            <TextInput
              style={styles.input}
              placeholder="DEAL TITLE"
              placeholderTextColor="#000"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="DISCOUNT"
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={discount}
              onChangeText={setDiscount}
            />
            <TextInput
              style={styles.input}
              placeholder="REDEMPTION POINTS"
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={redemptionPoints}
              onChangeText={setRedemptionPoints}
            />
          </View>
        </View>

        <View style={{ zIndex: 3000, marginBottom: open ? 160 : 12 }}>
          <DropDownPicker
            open={open}
            value={category}
            items={items}
            setOpen={setOpen}
            setValue={setCategory}
            setItems={setItems}
            placeholder="SELECT CATEGORY TYPE"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>


        <TextInput
          style={styles.descriptionInput}
          placeholder="DESCRIPTION"
          placeholderTextColor="#000"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

      <View style={{ zIndex: 2000, marginBottom: open2 ? 160 : 16 }}>
        <DropDownPicker
          open={open2}
          value={tier}
          items={items2}
          setOpen={setOpen2}
          setValue={setTier}
          setItems={setItems2}
          placeholder="SELECT FOR AVAILABILITY"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>

      <View style={{ zIndex: 1000, marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>{formatDate(expiryDate)}</Text>
          <Ionicons name="calendar-outline" size={18} />
        </TouchableOpacity>
      </View>


        {showDatePicker && (
          <DateTimePicker
            value={expiryDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && { opacity: 0.5 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>ADD DEAL</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  innerContainer: {
    paddingBottom: 40,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#98DB52",
  },
  topSection: {
    flexDirection: "row",
    marginBottom: 20,
  },
  avatarBox: {
    width: 150,
    height: 190,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderColor: "#98DB52",
    borderWidth: 2,
  },
  avatarText: {
    fontWeight: "bold",
    color: "#000",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  rightSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    color: "#000",
    borderColor: "#98DB52",
    borderWidth: 2,
  },
  descriptionInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    color: "#000",
    textAlignVertical: "top",
    borderColor: "#98DB52",
    borderWidth: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 0,
    marginBottom: 12,
    borderColor: "#98DB52",
    borderWidth: 2,
  },
  dropdownContainer: {
    backgroundColor: "#dcdcdc",
    borderWidth: 0,
  },
  datePickerButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#98DB52",
    borderWidth: 2,
  },
  datePickerText: {
    color: "#000",
  },
  submitButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 20,
    borderColor: "#98DB52",
    borderWidth: 2,
  },
  submitButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default CreateDeal;
