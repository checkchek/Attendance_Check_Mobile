import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { getDataCheck } from "./utils/apis";
import { BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSetRecoilState, useRecoilState } from "recoil";
import { lectureState, locState } from "./atoms";

export default function QRcodeScan() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const setLocCheck = useSetRecoilState(locState);
  const [lectureId, setLectureId] = useRecoilState(lectureState);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  });

  const navigation = useNavigation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
    return true;
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    let result;
    const [code, qrLectureId] = data.split(",");

    if (Number(qrLectureId) !== lectureId) {
      alert("다른 강의 입니다.");
    } else {
      result = await getDataCheck(code, lectureId);
    }

    if (result.result === "success") {
      Alert.alert(result.message);
      setLocCheck(true);
      handleBackPress();
    } else {
      Alert.alert(result.message);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <TouchableOpacity onPress={() => setScanned(false)}
          style={styles.button}>
          <Text style={styles.buttonText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    width: 180,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
