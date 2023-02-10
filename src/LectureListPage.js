import React, {useState} from 'react';
import {View, Button, Text} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {API_URL} from '@env';

export default function LectureListPage({navigation}) {
  const [verified, setVerified] = useState();

  return (
    <View>
      <Button title="{현재 진행중인 강의}" />
      <Text>{verified ? '인증 완료' : '인증 실패'}</Text>
    </View>
  );
}
