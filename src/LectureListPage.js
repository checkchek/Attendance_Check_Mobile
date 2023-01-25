import React from 'react';
import {View, Button} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {API_URL} from '@env';

export default function LectureListPage({navigation}) {
  const check = async () => {
    console.log('click');
    const result = await launchCamera({
      includeBase64: true,
      maxHeight: 1000,
      maxWidth: 1500,
    });

    const res = await (
      await fetch(`${API_URL}/api/face`, {
        method: 'post',
        body: result.assets[0].base64,
      })
    ).json();
    console.log(res);
  };
  return (
    <View>
      <Button title="{현재 진행중인 강의}" onPress={check} />
    </View>
  );
}
