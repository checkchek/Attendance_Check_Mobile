import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, TextInput, Button, Text, Alert } from "react-native";
import { storeData } from "./utils/storeData";
import { postLogin } from "./utils/apis";
import styled from "styled-components";


const Back = styled(View)`
  flex: 1;
  justifyContent: center;
  alignItems: center;
`;

export default function LoginPage({ navigation }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleSubmit = async () => {
    const result = await postLogin(id, pw);

    if (result.login === "success") {
      storeData("id", id);
      storeData("num", result.num);

      Alert.alert(result.message);
      navigation.navigate("LectureListPage");
    } else {
      Alert.alert(result.message);
    }
  };

  return (
    <Back>
      <View style={styles.container}>
        <Text style={styles.text}>Log In</Text>
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
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </Back>
    
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  input: {
    height: 40,
    width: 220,
    margin: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  text: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    marginBottom: 5,
  },
  button: {
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    marginVertical: 5,
    width: 100,
    alignItems: 'center',
    marginBottom: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
