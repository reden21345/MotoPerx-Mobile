import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: width * 0.05,
    alignItems: "flex-start",
    backgroundColor: "#fff",
  },
  arrowButton: {
    padding: 5,
    backgroundColor: "#98DB52",
    borderRadius: 5,
  },
  body: {
    paddingHorizontal: width * 0.08,
    paddingBottom: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    color: "#98DB52",
  },
  error: {
    color: "red",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#98DB52",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    paddingVertical: 12,
  },
  icon: {
    paddingLeft: 10,
  },
  avatarPicker: {
    alignSelf: "center",
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#98DB52",
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
  signUpButton: {
    backgroundColor: "#98DB52",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 15,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  locBtn: {
    backgroundColor: "#98DB52",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    position: "absolute", // Position it over the map
    bottom: 30, // Distance from the bottom of the screen
    alignSelf: "center", // Center horizontally
    backgroundColor: "#424242",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
    zIndex: 10, // Ensure it’s above the map
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  map: {
    width: "100%",
    height: "90%",
  },
  searchContainer: { flexDirection: "row", padding: 10 },
  input2: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: "#424242",
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
  },
  miniMap: {
    width: "100%",
    height: 150,
    marginVertical: 10,
  },
  datePickerText: {
    color: "#000",
  },
});
