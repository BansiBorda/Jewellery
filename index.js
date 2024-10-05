// App.js or index.js (wherever you initialize your app)
import React from 'react';
import { AppRegistry, LogBox } from 'react-native';
import App from './App'; // Your main App component
import { name as appName } from './app.json';

import firebase from '@react-native-firebase/app';

LogBox.ignoreAllLogs(['Warning: ...']);

// Ensure Firebase is initialized
if (!firebase.apps.length) {
  firebase.initializeApp();
}

// Log to check if Firebase is initialized
console.log('Firebase initialized:', firebase.apps.length > 0);

AppRegistry.registerComponent(appName, () => App);