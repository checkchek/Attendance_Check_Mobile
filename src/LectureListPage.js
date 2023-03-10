import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Button, Text, Alert} from 'react-native';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {API_URL} from './utils/ip';
import {getData} from './utils/storeData';

export default function LectureListPage({navigation}) {
  const [verified, setVerified] = useState();
  const [availableState, setAvailable] = useState();
  const [biometryTypeState, setBiometryType] = useState();
  const [lectures, setLectures] = useState();
  const [my_stdno, setMyStdno] = useState();
  const [rnBiometrics, setRnBiometrics] = useState();

  useEffect(() => {
    setRnBiometrics(
      new ReactNativeBiometrics({
        allowDeviceCredentials: true,
      }),
    );
    getData('stdno').then(v => {
      setMyStdno(v);
    });
  }, []);

  // 강의 목록 받아오기
  useEffect(() => {
    async function getLectures(my_stdno) {
      const res = await fetch(`${API_URL}/api/lectureList?stdno=${my_stdno}`);
      const jsonData = await res.json();
      return jsonData;
    }
    if (my_stdno) {
      getLectures(my_stdno).then(v => {
        setLectures(v.lecture_list);
      });
    }
  }, [my_stdno]);

  // 센서 사용 가능 여부
  useEffect(() => {
    if (rnBiometrics) {
      rnBiometrics.isSensorAvailable().then(resultObj => {
        const {available, biometryType} = resultObj;
        setAvailable(available);
        setBiometryType(biometryType);

        if (available && biometryType === BiometryTypes.TouchID) {
          console.log('TouchID is supported');
        } else if (available && biometryType === BiometryTypes.FaceID) {
          console.log('FaceID is supported');
        } else if (available && biometryType === BiometryTypes.Biometrics) {
          console.log('Biometrics is supported');
        } else {
          console.log('Biometrics not supported');
        }
      });
    }
  }, [rnBiometrics]);

  const onPress = async lecture => {
    // 생체 인증 지원 X
    if (!availableState) {
      setVerified(1);
      Alert.alert('bio 없어서 임시로 인증 완료');

      try {
        // Todo. week 값을 어떻게 자동으로 설정할지 고민해야함
        await fetch(
          `${API_URL}/api/check?stdno=${my_stdno}&lecture=${lecture}&week=1`,
        );
      } catch (error) {
        console.log(error);
      }
    }
    // 생체 인증 지원 O
    else {
      // 인증
      const {success} = await rnBiometrics
        .simplePrompt({
          promptMessage: 'Confirm fingerprint',
        })
        .catch(() => {
          console.log('biometrics failed');
        });

      // 인증 여부에 따른 진행
      if (success) {
        console.log('successful biometrics provided');
        setVerified(1);
        Alert.alert('인증 완료');
        try {
          console.log(
            `${API_URL}/api/check?stdno=${my_stdno}&lecture=${lecture}&week=3`,
          );
          await fetch(
            `${API_URL}/api/check?stdno=${my_stdno}&lecture=${lecture}&week=3`,
          );
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log('user cancelled biometric prompt');
        setVerified(0);
      }
    }
  };
  return (
    <View style={styles.container}>
      <Text>현재 진행 중인 강의</Text>

      <Text>내 강의 목록</Text>
      <View style={styles.button}>
        {lectures
          ? lectures.map(lecture => (
              <Button
                key={lecture}
                title={lecture}
                onPress={() => onPress(lecture)}
              />
            ))
          : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  button: {
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
