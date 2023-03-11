import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";
import { storeData } from "./utils/storeData";
import { postLogin } from "./utils/apis";

export default function LoginPage({ navigation }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleSubmit = async () => {
    const result = await postLogin(id, pw);

    if (result.login === "success") {
      storeData("id", id);
      storeData("num", result.num);
      navigation.navigate("LectureListPage");
    } else {
      Alert.alert(result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login Page</Text>
      <TextInput
        style={styles.input}
        placeholder="ID를 입력해주세요."
        value={id}
        onChangeText={(val) => setId(val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password를 입력해주세요."
        value={pw}
        onChangeText={(val) => setPw(val)}
      />
      <Button onPress={handleSubmit} title="로그인" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    width: "70%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
