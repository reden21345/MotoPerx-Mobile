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
import DropDownPicker from "react-native-dropdown-picker";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../redux/actions/productAction";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { RadioButton } from "react-native-paper";
import { handlePickImages, handleRemoveImage } from "../../utils/helpers";
import { PRODUCT_OPTIONS, SERVICE_OPTIONS } from "../../utils/constants";

const CreateProduct = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [category, setCategory] = useState(null);

  // Product / Service type dropdown
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeValue, setTypeValue] = useState(null);
  const [typeItems, setTypeItems] = useState([]);

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    setTypeValue(null); // Reset type when category changes
    if (selectedCategory === "Products") {
      setTypeItems(PRODUCT_OPTIONS);
    } else {
      setTypeItems(SERVICE_OPTIONS);
    }
  };

  const handleSubmit = async () => {
    if (!name || !description || !price || !category || !typeValue) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    const info = {
      category,
    };

    if (category === "Products") {
      info.productType = typeValue;
    } else if (category === "Services") {
      info.serviceType = typeValue;
    }

    const data = {
      name,
      description,
      price: Number(price),
      createdBy: user?._id,
      info,
      images,
    };

    try {
      setIsSubmitting(true);
      await dispatch(createProduct(data)).unwrap();
      Alert.alert("Success", "Product added successfully!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Create Failed", err || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <SafeAreaView style={styles.form}>
          <Text style={styles.screenTitle}>Add Product/Service</Text>

          <TextInput
            style={styles.input}
            placeholder="Product/Service name"
            value={name}
            onChangeText={setName}
          />

          {/* Radio Buttons for Category */}
          <RadioButton.Group
            onValueChange={handleCategoryChange}
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

          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => handlePickImages(setImages)}
          >
            <Text style={styles.imageButtonText}>
              <Ionicons name="images-sharp" size={30} color={"#000"} />
            </Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} />
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
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Creating..." : "Add Product"}
            </Text>
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
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    zIndex: 999, // Ensures dropdown shows properly
  },
  dropdownContainer: {
    zIndex: 998,
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
    backgroundColor: "white",
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
});

export default CreateProduct;
