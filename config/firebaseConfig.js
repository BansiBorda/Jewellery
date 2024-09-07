import { initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyArnecsjYx_jWs2xOlg8jwk_IWTmV_rP14",
  authDomain: "jewelryapp-7a385.firebaseapp.com",
  projectId: "jewelryapp-7a385",
  storageBucket: "jewelryapp-7a385.appspot.com",
  messagingSenderId: "50587793595",
  appId: "1:50587793595:web:1cc9636cab57351dd2119e",
  measurementId: "G-FQYQX3DLTY"
};

// Initialize Firebase
if (!initializeApp.apps.length) {
  initializeApp(firebaseConfig);
}

export default initializeApp;
