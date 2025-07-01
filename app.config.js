import 'dotenv/config';
import appConfig from './app.json';

export default ({ config }) => ({
  ...appConfig.expo,
  android: {
    ...appConfig.expo.android,
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API
      }
    }
  },
  extra: {
    ...appConfig.expo.extra,
    EXPO_URL: process.env.EXPO_URL,
    GOOGLE_MAPS_API: process.env.GOOGLE_MAPS_API,
  },
});
