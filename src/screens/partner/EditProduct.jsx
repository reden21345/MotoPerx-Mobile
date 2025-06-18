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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../redux/actions/productAction";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { RadioButton } from "react-native-paper";
import { handlePickImages, handleRemoveImage } from "../../utils/helpers";
import { PRODUCT_OPTIONS, SERVICE_OPTIONS } from "../../utils/constants";

const EditProduct = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { product } = route.params;

  const [name, setName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(String(product.price) || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState(product.images || []);

  const [category, setCategory] = useState(product.info?.category);
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeValue, setTypeValue] = useState(
    product.info?.productType || product.info?.serviceType || null
  );
  const [typeItems, setTypeItems] = useState(
    product.info?.productType ? PRODUCT_OPTIONS : SERVICE_OPTIONS
  );

  const handleSubmit = async () => {
    if (!name || !description || !price || !category) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    const data = {
      id: product._id,
      name,
      description,
      price: Number(price),
      info:
        category === "Products"
          ? { category: "Products", productType: typeValue }
          : { category: "Services", serviceType: typeValue },
      createdBy: product.createdBy,
      images,
    };

    try {
      setIsSubmitting(true);
      await dispatch(updateProduct(data)).unwrap();
      Alert.alert("Success", "Product updated successfully!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Update Failed", err || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView style={styles.form}>
          <Text style={styles.screenTitle}>Edit Product</Text>

          <TextInput
            style={styles.input}
            placeholder="Product name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Select Category</Text>
          <RadioButton.Group
            onValueChange={(value) => {
              setCategory(value);
              setTypeValue(null);
              setTypeItems(
                value === "Products" ? PRODUCT_OPTIONS : SERVICE_OPTIONS
              );
            }}
            value={category}
          >
            <View style={styles.radioGroup}>
              <View style={styles.radioOption}>
                <RadioButton value="Products" />
                <Text style={styles.radioLabel}>Products</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="Services" />
                <Text style={styles.radioLabel}>Services</Text>
              </View>
            </View>
          </RadioButton.Group>

          {category && (
            <DropDownPicker
              open={typeOpen}
              value={typeValue}
              items={typeItems}
              setOpen={setTypeOpen}
              setValue={setTypeValue}
              setItems={setTypeItems}
              placeholder={`Select ${
                category === "Products" ? "Product" : "Service"
              } Type`}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              searchable={true}
              searchPlaceholder="Search type..."
              listMode="SCROLLVIEW"
              nestedScrollEnabled={true}
              zIndex={1000}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            multiline={true}
            onChangeText={setDescription}
          />

          <TextInput
            style={styles.input}
            placeholder="Price"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

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
              <Text style={styles.submitButtonText}>Save Product</Text>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
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
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    alignItems: "center",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    fontSize: 16,
  },
});

export default EditProduct;
