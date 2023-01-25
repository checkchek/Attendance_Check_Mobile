import React, {useState} from 'react';
import {StyleSheet, View, Text, TextInput, Button, Alert} from 'react-native';
import {db} from '../db';

export default function LoginPage({navigation}) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const handleSubmit = () => {
    console.log(id, pw);
    if (db[0].id === id && db[0].pw === pw) {
      navigation.navigate('LectureListPage');
    } else {
      Alert.alert('로그인 정보가 일치하지 않습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login Page</Text>
      <TextInput
        style={styles.input}
        placeholder="ID를 입력해주세요."
        value={id}
        onChangeText={val => setId(val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password를 입력해주세요."
        value={pw}
        onChangeText={val => setPw(val)}
      />
      <Button onPress={handleSubmit} title="Submit" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '70%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
