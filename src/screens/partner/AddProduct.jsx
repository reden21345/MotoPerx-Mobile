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
import DropDownPicker from "react-native-dropdown-picker";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../redux/actions/productAction";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

const CreateProduct = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Products", value: "Products" },
    { label: "Services", value: "Services" },
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

  const handleSubmit = async () => {
    if (
      !name ||
      !description ||
      !price ||
      !category
    ) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    const data = {
      name,
      description,
      price: Number(price),
      types: category,
      createdBy: user?._id,
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
            placeholder="Price"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />


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

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>Creating...</Text>
            ) : (
              <Text style={styles.submitButtonText}>Add Product</Text>
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
});

export default CreateProduct;