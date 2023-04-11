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
const Section1 = styled(View)`
  padding: 30px;
  border: 1px;
  border-radius: 20px;
  alignItems: center;
`;
const INPUT = styled(TextInput)`
  background-color: #f6f6f6;
  border: 1px;
  border-radius: 12px;
  padding: 15px;
  margin: 10px;
  width: 220px;
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
        <Section1 style={styles.box1}>
          <Text style={styles.text}>Log In</Text>
          <INPUT
            placeholder="ID를 입력해주세요."
            value={id}
            onChangeText={(val) => setId(val)}
          />
          <INPUT
            placeholder="Password를 입력해주세요."
            value={pw}
            onChangeText={(val) => setPw(val)}
            secureTextEntry={true}
          />
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>로그인</Text>
          </TouchableOpacity>
        </Section1>
    </Back>
  );
}

const styles = StyleSheet.create({
  box1: {
    
  },
  text: {
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
    marginBottom: 15,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    marginVertical: 20,
    width: 100,
    alignItems: 'center',
    marginBottom: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
