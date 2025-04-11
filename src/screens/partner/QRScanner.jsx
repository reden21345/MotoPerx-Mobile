import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button, Animated, Easing, Dimensions } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import ScannedQR from "../../components/partners/ScannedQR"; 

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCAN_SIZE = 250; // the size of the scanning square

const QRScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedQR, setScannedQR] = useState(null);

  // Animated value for the moving scanning line
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    askForCameraPermission();
  }, []);

  useEffect(() => {
    // Continuously animate the scanning line up and down inside the scanning box
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: SCAN_SIZE - 10, // move from top to near the bottom inside the box
          duration: 2500,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ])
    ).start();
  }, [moveAnim]);

  const askForCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setScannedQR(data);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title="Allow Camera" onPress={askForCameraPermission} />
      </View>
    );
  }

  // If scanned, show your ScannedQR component
  if (scanned) {
    return <ScannedQR scannedQR={scannedQR} setScanned={setScanned} />;
  }

  // Otherwise, show the scanner
  return (
    <View style={styles.container}>
      {/* The camera preview covers the entire screen */}
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* A semi-transparent overlay to darken everything except the scan area */}
      <View style={styles.overlay}>
        <View style={styles.scanAreaContainer}>
          {/* The four corner brackets */}
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />

          {/* Animated scanning line */}
          <Animated.View
            style={[
              styles.scannerLine,
              { transform: [{ translateY: moveAnim }] },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

export default QRScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    // Fill the screen with a half-transparent overlay
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  scanAreaContainer: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    position: "relative",
    // This creates a "hole" by leaving this area unmasked
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#fff",
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scannerLine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 2,
    backgroundColor: "#00ff00", // bright green scanning line
  },
});
