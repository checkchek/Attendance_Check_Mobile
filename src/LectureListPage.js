import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Button, Text, Alert} from 'react-native';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';

export default function LectureListPage({navigation}) {
  const [verified, setVerified] = useState();
  const [availableState, setAvailable] = useState();
  const [biometryTypeState, setBiometryType] = useState();

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  useEffect(() => {
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
  });

  //data_check()
  const onPress = async lecture => {
    console.log('press');
    if (!availableState) {
      setVerified(1);
      Alert.alert('bio 없어서 임시로 인증 완료');
      const my_stdno = 20183333; // Todo. DB에서 학번을 받아 와야함.

      try {
        // Todo. week 값을 어떻게 자동으로 설정할지 고민해야함
        await fetch(
          `${process.env.API_URL}/api/check?stdno=${my_stdno}&lecture=${lecture}&week=1`,
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      // Biometrics is supported
      rnBiometrics
        .simplePrompt({promptMessage: 'Confirm fingerprint'})
        .then(resultObject => {
          const {success} = resultObject;
          if (success) {
            console.log('successful biometrics provided');
            setVerified(1);
            Alert.alert('인증 완료');
            // Todo. 출석 체크 API 호출
          } else {
            console.log('user cancelled biometric prompt');
            setVerified(0);
          }
        })
        .catch(() => {
          console.log('biometrics failed');
        });
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Button title="현재 진행중인 강의" />
      </View>

      {/* Todo. DB 에서 강의 목록 받아오는 작업 해야함. */}
      <View style={styles.button}>
        <Button title="C언어" onPress={() => onPress('C언어')} />
        <Button title="네트워크" onPress={() => onPress('네트워크')} />
      </View>

      <View>
        <Text style={{textAlign: 'center'}}>
          {verified ? '인증 완료' : '인증 실패'}
        </Text>
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
