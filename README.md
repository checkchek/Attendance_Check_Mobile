```bash
git clone -b master https://github.com/checkchek/Attendance_Check_Mobile.git (Latest version of code)

npm install -g expo-cli      

npm i

npx expo install expo-local-authentication@~13.3.0 react-native@0.71.14 expo-dev-client@~2.2.1

Modify API_URL in src/utils/apis.js path
-> export const API_URL = "http://(IP address currently in use):3003";

Modify firstDay in src/LectureListPage.js, src/utils/apis.js path
-> const firstDay = new Date("Date the semester starts(YYYY-MM-DD, ex. 2023-09-01)").getTime();

npm start

Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```