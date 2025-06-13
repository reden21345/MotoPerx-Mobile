import React, { useState, useEffect } from "react";
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
import { RadioButton } from "react-native-paper";
import { useDispatch } from "react-redux";
import { updateDeals } from "../../redux/actions/dealsAction";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import {
  handlePickImages,
  formatDate,
  handleRemoveImage,
} from "../../utils/helpers";

const EditDeal = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { deal } = route.params;

  const [title, setTitle] = useState(deal.title || "");
  const [description, setDescription] = useState(deal.description || "");
  const [discount, setDiscount] = useState(null);
  const [isDiscount, setIsDiscount] = useState(false);
  const [free, setFree] = useState(null);
  const [stamp, setStamp] = useState(null);
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

  const [tier, setTier] = useState(deal.tier || null);

  useEffect(() => {
    if (deal?.discount !== undefined) {
      setIsDiscount(true);
      setDiscount(String(deal.discount));
    } else {
      setStamp(String(deal.stampInfo.stamp));
      setFree(String(deal.stampInfo.free));
    }
  }, [deal]);

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
      expiryDate,
      redemptionPoints: Number(redemptionPoints),
      category,
      tier,
      createdBy: deal.createdBy,
      updatedAt: Date.now(),
      images,
    };

    if (discount) {
      data.discount = Number(discount);
    } else {
      data.stampInfo = {
        stamp,
        free,
      };
    }

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

          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            multiline={true}
            onChangeText={setDescription}
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

          {isDiscount ? (
            <>
              <Text style={styles.radioLabel}>DISCOUNT</Text>
              <TextInput
                style={styles.input}
                placeholder="Discount (%)"
                keyboardType="numeric"
                value={discount}
                onChangeText={setDiscount}
              />
            </>
          ) : (
            <>
              <Text style={styles.radioLabel}>STAMP INFO</Text>
              <TextInput
                style={styles.input}
                placeholder="Total Stamps"
                keyboardType="numeric"
                value={stamp}
                onChangeText={setStamp}
              />
              <TextInput
                style={styles.input}
                placeholder="Stamp with free product/service"
                keyboardType="numeric"
                value={free}
                onChangeText={setFree}
              />
            </>
          )}
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

export default EditDeal;
