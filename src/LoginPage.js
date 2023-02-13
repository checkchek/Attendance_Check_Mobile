import React, {useState} from 'react';
import {StyleSheet, View, Text, TextInput, Button, Alert} from 'react-native';
import {storeData} from './utils/storeData';

export default function LoginPage({navigation}) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  console.log(process.env.API_URL);
  const handleSubmit = async () => {
    const result = await (
      await fetch('http://192.168.0.141:3003/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id,
          pw,
        }),
      })
    ).json();

    if (result.login === 'success') {
      storeData('id', id);
      navigation.navigate('LectureListPage');
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
