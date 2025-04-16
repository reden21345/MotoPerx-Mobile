import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import AppContent from './AppContent';

enableScreens();

export default function App() {
  return (
    <Provider store={store}>
      <AppContent/>
    </Provider>
  );
}
