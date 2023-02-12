import React, {useState} from 'react';
import {StyleSheet, View, Button, Text} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {API_URL} from '@env';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'

export default function LectureListPage({navigation}) {
  const [verified, setVerified] = useState();
  
  const rnBiometrics = new ReactNativeBiometrics()

  //isSensorAvailable()
  rnBiometrics.isSensorAvailable()
  .then((resultObject) => {
    const { available, biometryType } = resultObject

    if (available && biometryType === BiometryTypes.TouchID) {
      console.log('TouchID is supported')
    } else if (available && biometryType === BiometryTypes.FaceID) {
      console.log('FaceID is supported')
    } else if (available && biometryType === BiometryTypes.Biometrics) {
      console.log('Biometrics is supported')
    } else {
      console.log('Biometrics not supported')
    }
  })


  //createKeys()
  rnBiometrics.createKeys()
  .then((resultObject) => {
    const { publicKey } = resultObject
    console.log(publicKey)
    sendPublicKeyToServer(publicKey)
  })


  //biometricKeysExist()
  rnBiometrics.biometricKeysExist()
  .then((resultObject) => {
    const { keysExist } = resultObject

    if (keysExist) {
      console.log('Keys exist')
    } else {
      console.log('Keys do not exist or were deleted')
    }
  })


  //deleteKeys()
  rnBiometrics.deleteKeys()
  .then((resultObject) => {
    const { keysDeleted } = resultObject

    if (keysDeleted) {
      console.log('Successful deletion')
    } else {
      console.log('Unsuccessful deletion because there were no keys to delete')
    }
  })


  //data_check()
  rnBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
  .then((resultObject) => {
    const { success } = resultObject

    if (success) {
      console.log('successful biometrics provided')
      setVerified(1)
    } else {
      console.log('user cancelled biometric prompt')
      setVerified(0)
    }
  })
  .catch(() => {
    console.log('biometrics failed')
  })
  return (
    <View style={styles.container}>
      <View>
        <Button title="현재 진행중인 강의" />
      </View>
      
      <View style={styles.button}>
        <Button title="소프트웨어 설계" onPress={()=>alert('인증이 필요합니다.')}/>
        <Button title="웹 프로그래밍" onPress={()=>alert('인증이 필요합니다.')}/>
      </View>
      
      <View>
        <Text style={{textAlign: 'center'}}>{verified ? '인증 완료' : '인증 실패'}</Text>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  button: {
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});