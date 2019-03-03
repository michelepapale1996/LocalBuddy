/** @format */
import bgMessaging from './res/bgMessaging';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
//to receive background notifications
//AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);