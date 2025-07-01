import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
import AppContent from "./AppContent";
import * as Notifications from "expo-notifications";
import { NotificationProvider } from "./src/hooks/NotificationContext";
import Constants from "expo-constants";

enableScreens();

export default function App() {
  console.log(Constants.expoConfig?.extra?.EXPO_URL);
  console.log(Constants.manifest?.extra?.EXPO_URL);
  console.log(Constants.manifest2?.extra?.EXPO_URL);
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  return (
    <NotificationProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </NotificationProvider>
  );
}
