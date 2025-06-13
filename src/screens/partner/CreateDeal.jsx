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
      data.stampInfo = {
        stamp,
        free,
      };
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
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>ADD DEALS</Text>
        </View>
        <View style={styles.imageRow}>
          <TouchableOpacity
            style={styles.selectImage}
            onPress={() => handlePickImages(setImages)}
          >
            <Ionicons name="add" size={32} color="#fff" />
          </TouchableOpacity>
          <View style={styles.previewRow}>
            {images.map((uri, index) => (
              <View key={index} style={styles.previewBox}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => handleRemoveImage(index, setImages)}
                >
                  <Ionicons name="close-circle" size={18} color="#f00" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.rowInputs}>
          <TextInput
            style={styles.inputBox}
            placeholder="DEAL TITLE"
            placeholderTextColor="#000"
            value={title}
            onChangeText={setTitle}
          />

          <TouchableOpacity
            style={[styles.dateButton, { marginBottom: 12 }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(expiryDate)}</Text>
            <Ionicons name="calendar-outline" size={16} />
          </TouchableOpacity>

          <TextInput
            style={styles.inputBox}
            placeholder="REDEMPTION POINTS"
            placeholderTextColor="#000"
            keyboardType="numeric"
            value={redemptionPoints}
            onChangeText={setRedemptionPoints}
          />
        </View>

        <Text style={styles.radioLabel}>DEAL TYPE</Text>
        <View style={styles.radioContainer}>
          <RadioButton.Group
            onValueChange={(value) => setChoice(value)}
            value={choice}
          >
            <View style={styles.radioOption}>
              <RadioButton value={"Discount"} />
              <Text>Discount</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value={"Loyalty"} />
              <Text>Loyalty Card</Text>
            </View>
          </RadioButton.Group>
        </View>

        {choice === "Discount" && (
          <TextInput
            style={styles.input}
            placeholder="DISCOUNT"
            placeholderTextColor="#000"
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
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={stamp}
              onChangeText={setStamp}
            />
            <TextInput
              style={styles.input}
              placeholder="FREE PRODUCT/SERVICE"
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={free}
              onChangeText={setFree}
            />
          </>
        )}

        <Text style={styles.radioLabel}>CATEGORY</Text>
        <View style={styles.radioContainer}>
          <RadioButton.Group
            onValueChange={(value) => setCategory(value)}
            value={category}
          >
            <View style={styles.radioOption}>
              <RadioButton value={"Product"} />
              <Text>Product</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value={"Service"} />
              <Text>Service</Text>
            </View>
          </RadioButton.Group>
        </View>

        <Text style={styles.radioLabel}>AVAILABILITY</Text>
        <View style={styles.radioContainer}>
          <RadioButton.Group
            onValueChange={(value) => setTier(value)}
            value={tier}
          >
            <View style={styles.radioOption}>
              <RadioButton value={"Bronze"} />
              <Text>Bronze</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value={"Silver"} />
              <Text>Silver</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value={"Gold"} />
              <Text>Gold</Text>
            </View>
          </RadioButton.Group>
        </View>

        <TextInput
          style={styles.descriptionInput}
          placeholder="DESCRIPTION"
          placeholderTextColor="#000"
          multiline
          numberOfLines={6}
          value={description}
          onChangeText={setDescription}
        />

        {showDatePicker && (
          <DateTimePicker
            value={expiryDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

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
  headerContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  selectImage: {
    width: 60,
    height: 60,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
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
    gap: 6,
    marginBottom: 12,
  },
  inputBox: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 4,
    color: "#000",
    fontWeight: "bold",
  },
  dropdown: {
    backgroundColor: "#e0e0e0",
    marginBottom: 12,
    borderColor: "#000",
  },
  dropdownHalf: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    marginRight: 8,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
  },
  descriptionInput: {
    backgroundColor: "#e0e0e0",
    color: "#000",
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
    fontWeight: "bold",
  },
  dateButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 4,
  },
  dateText: {
    color: "#000",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#e0e0e0",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 24,
  },
  submitText: {
    fontWeight: "bold",
    color: "#000",
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
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
});

export default CreateDeal;
