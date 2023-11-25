git clone -b master https://github.com/checkchek/Attendance_Check_Mobile.git (Latest version of code)

npm install -g expo-cli      

npm i

npx expo install expo-local-authentication@~13.3.0 react-native@0.71.14 expo-dev-client@~2.2.1

Modify API_URL in src/utils/apis.js path
-> export const API_URL = "http://(IP address currently in use):3003";

npm start

Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
