import React from 'react';
import {StyleSheet} from 'react-native';
import LoginPage from './src/LoginPage';
import LectureListPage from './src/LectureListPage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  console.log('App start');
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="LectureListPage" component={LectureListPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
