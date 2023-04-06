import React, { useState } from "react";
import { KeyboardAvoidingView, Image, View, TextInput, Button, Alert } from "react-native";
import { storeData } from "./utils/storeData";
import { postLogin } from "./utils/apis";
import styled from "styled-components";


const Back = styled(View)`
  background-color: #005598;
  flex: 1;
  justifyContent: center;
  alignItems: center;
`;
const Section1 = styled(View)`
  resizeMode: cover;
  margin-right: 10px;
  margin-bottom: 130px;
  object-fit: contain;
`;
const Section2 = styled(View)`
  padding: 20px;
  border-radius: 20px;
  margin: 30px;
`;
const INPUT = styled(TextInput)`
  background-color: #f6f6f6;
  border: 1px;
  border-radius: 12px;
  padding: 15px;
  margin: 10px;
  width: 200px;
`;
const BUTTON = styled(Button)`
  border: 1px;
  border-radius: 12px;
  color: #f00;
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
      <Section1>
        <Image 
        source={require('../assets/cwnu_logo.jpg')}/>
      </Section1>
      <KeyboardAvoidingView behavior={'position'}>
        <Section2>
          <INPUT
            placeholder="아이디"
            value={id}
            onChangeText={(val) => setId(val)}
          />
          <INPUT
            placeholder="비밀번호"
            value={pw}
            onChangeText={(val) => setPw(val)}
            secureTextEntry={true}
          />
          <BUTTON onPress={handleSubmit} title="로그인" />
        </Section2>
      </KeyboardAvoidingView>
      
    </Back>
  );
}
