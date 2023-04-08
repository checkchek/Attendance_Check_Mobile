import React from "react";
import LoginPage from "./src/LoginPage";
import LectureListPage from "./src/LectureListPage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "react-query";
import QRcodeScan from "./src/QRcodeScan";
import { RecoilRoot } from "recoil";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  console.log("App start");
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="LoginPage"
              component={LoginPage}
              options={{
                title: "로그인",
              }}
            />
            <Stack.Screen
              name="LectureListPage"
              component={LectureListPage}
              options={{
                title: "강의 목록",
              }}
            />
            <Stack.Screen
              name="QRcodescan"
              component={QRcodeScan}
              options={{
                title: "위치 인증",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </RecoilRoot>
    </QueryClientProvider>
  );
}
