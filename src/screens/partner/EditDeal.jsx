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
import { useDispatch } from "react-redux";
import { updateDeals } from "../../redux/actions/dealsAction";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { handlePickImages, formatDate, handleRemoveImage } from "../../utils/helpers";

const EditDeal = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { deal } = route.params;

  const [title, setTitle] = useState(deal.title || "");
  const [description, setDescription] = useState(deal.description || "");
  const [discount, setDiscount] = useState(String(deal.discount) || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [redemptionPoints, setRedemptionPoints] = useState(
    String(deal.redemptionPoints) || ""
  );
  const [images, setImages] = useState(deal.images || []);

  const [expiryDate, setExpiryDate] = useState(
    deal.expiryDate ? new Date(deal.expiryDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [category, setCategory] = useState(deal.category || null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Product", value: "Product" },
    { label: "Service", value: "Service" },
  ]);

  const [tier, setTier] = useState(deal.tier || null);
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
      id: deal._id,
      partner: deal.partner._id,
      title,
      description,
      discount: Number(discount),
      expiryDate,
      redemptionPoints: Number(redemptionPoints),
      category,
      tier,
      createdBy: deal.createdBy,
      updatedAt: Date.now(),
      images,
    };

    try {
      setIsSubmitting(true);
      await dispatch(updateDeals(data)).unwrap();
      Alert.alert("Success", "Deal updated successfully!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Update Failed", err || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <SafeAreaView style={styles.form}>
          <Text style={styles.screenTitle}>Edit Deal</Text>

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

          <DropDownPicker
            open={open2}
            value={tier}
            items={items2}
            setOpen={setOpen2}
            setValue={setTier}
            setItems={setItems2}
            placeholder="Select tier availability"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
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
            onPress={() => handlePickImages(setImages)}
          >
            <Text style={styles.imageButtonText}>
              <Ionicons name="images-sharp" size={30} color={"#000"} />
            </Text>
          </TouchableOpacity>

          {/* Display Selected Images */}
          {images.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    key={index}
                    source={{ uri: image?.url ? image.url : image }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index, setImages)}
                  >
                    <Text style={styles.removeImageText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>Saving...</Text>
            ) : (
              <Text style={styles.submitButtonText}>Save Deal</Text>
            )}
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

export default EditDeal;
