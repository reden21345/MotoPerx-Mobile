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
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { createDeals } from "../../redux/actions/dealsAction";
import { Ionicons } from "@expo/vector-icons";
import {
  handlePickImages,
  formatDate,
  handleRemoveImage,
} from "../../utils/helpers";

const CreateDeal = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { partner } = useSelector((state) => state.partners);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tier, setTier] = useState(null);
  const [discount, setDiscount] = useState("");
  const [free, setFree] = useState("");
  const [stamp, setStamp] = useState("");
  const [choice, setChoice] = useState(null);
  const [redemptionPoints, setRedemptionPoints] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState(null);

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
      !choice ||
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
      expiryDate,
      redemptionPoints,
      category,
      tier,
      createdBy: user?._id,
      images,
    };

    if (choice === "Discount") {
      if (!discount) {
        Alert.alert("Error", "Please fill discount info.");
        return;
      }
      data.discount = Number(discount);
    } else {
      if (!free || !stamp) {
        Alert.alert("Error", "Please fill the loyalty card info.");
        return;
      }
      data.stampInfo = { stamp, free };
      data.discount = null
    }

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
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.header}>ADD DEAL</Text>
        <View style={styles.imageSection}>
          <View style={styles.column}>
            <Text style={styles.sectionLabel}>SELECT IMAGE</Text>
            <TouchableOpacity
              style={styles.selectImage}
              onPress={() => handlePickImages(setImages)}
            >
              <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.column}>
            <Text style={styles.sectionLabel}>PREVIEW IMAGES</Text>
            <View style={styles.previewRow}>
              {images.map((uri, index) => (
                <View key={index} style={styles.previewBox}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeIcon}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Ionicons name="close-circle" size={18} color="#f00" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.rowInputs}>
          <TextInput
            style={styles.inputBox}
            placeholder="Deal Title"
            placeholderTextColor="#363636"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.inputBox}
            placeholder="Redemption Points"
            placeholderTextColor="#363636"
            keyboardType="numeric"
            value={redemptionPoints}
            onChangeText={setRedemptionPoints}
          />
        </View>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            Expiry Date: {formatDate(expiryDate)}
          </Text>
          <Ionicons name="calendar-outline" size={16} />
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

        <View style={styles.groupRow}>
          <View style={styles.groupBox}>
            <Text style={styles.radioLabel}>Category</Text>
            <RadioButton.Group onValueChange={setCategory} value={category}>
              <View style={styles.radioOption}>
                <RadioButton value="Product" />
                <Text>Product</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="Service" />
                <Text>Service</Text>
              </View>
            </RadioButton.Group>
          </View>

          <View style={styles.groupBox}>
            <Text style={styles.radioLabel}>Tier Level</Text>
            <RadioButton.Group onValueChange={setTier} value={tier}>
              <View style={styles.radioOption}>
                <RadioButton value="Bronze" />
                <Text>Bronze</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="Silver" />
                <Text>Silver</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="Gold" />
                <Text>Gold</Text>
              </View>
            </RadioButton.Group>
          </View>
        </View>

        <View style={styles.groupBox}>
          <Text style={styles.radioLabel}>Deal Type</Text>
          <RadioButton.Group onValueChange={setChoice} value={choice}>
            <View style={styles.radioOption}>
              <RadioButton value="Discount" />
              <Text>Discount</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="Loyalty" />
              <Text>Loyalty Card</Text>
            </View>
          </RadioButton.Group>

          {choice === "Discount" && (
            <TextInput
              style={styles.input}
              placeholder="DISCOUNT"
              placeholderTextColor="#363636"
              keyboardType="numeric"
              value={discount}
              onChangeText={setDiscount}
            />
          )}

          {choice === "Loyalty" && (
            <>
              <TextInput
                style={styles.input}
                placeholder="TOTAL STAMPS"
                placeholderTextColor="#363636"
                keyboardType="numeric"
                value={stamp}
                onChangeText={setStamp}
              />
              <TextInput
                style={styles.input}
                placeholder="FREE PRODUCT/SERVICE"
                placeholderTextColor="#363636"
                value={free}
                onChangeText={setFree}
              />
            </>
          )}
        </View>

        <TextInput
          style={styles.descriptionInput}
          placeholder="Description"
          placeholderTextColor="#363636"
          multiline
          numberOfLines={6}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && { opacity: 0.5 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitText}>ADD DEAL</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  innerContainer: {
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  imageSection: {
    flexDirection: "row",
    marginBottom: 16,
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 4,
    padding: 12,
  },
  column: {
    marginRight: 8,
  },
  sectionLabel: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },
  selectImage: {
    width: 60,
    height: 60,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  previewRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  previewBox: {
    width: 60,
    height: 60,
    borderColor: "#aaa",
    borderWidth: 1,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: 60,
    height: 60,
    resizeMode: "cover",
  },
  removeIcon: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },
  inputBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 2,
    padding: 10,
    borderRadius: 4,
    color: "#000",
    fontWeight: "bold",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateButton: {
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 2,
    padding: 10,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateText: {
    color: "#000",
  },
  groupRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  groupBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 2,
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 2,
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
    color: "#000",
    fontWeight: "bold",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  descriptionInput: {
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 2,
    padding: 12,
    borderRadius: 4,
    color: "#000",
    marginBottom: 12,
    fontWeight: "bold",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButton: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 5,
  },
  submitText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
  },
});

export default CreateDeal;
