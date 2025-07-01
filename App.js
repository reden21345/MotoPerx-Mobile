import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
import AppContent from "./AppContent";
import * as Notifications from "expo-notifications";
import { NotificationProvider } from "./src/hooks/NotificationContext";

enableScreens();

export default function App() {
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
