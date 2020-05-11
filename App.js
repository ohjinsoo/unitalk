import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { MenuProvider } from 'react-native-popup-menu';
import * as firebase from 'firebase';
import { YellowBox } from 'react-native';
import HomeScreen from './src/screens/HomeScreen'
import ThreadScreen from './src/screens/ThreadScreen'
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import CreateThreadScreen from './src/screens/CreateThreadScreen';
import ChatScreen from './src/screens/ChatScreen'
import CreateChatScreen from './src/screens/CreateChatScreen';
import SetUsernameScreen from './src/screens/SetUsernameScreen';
import AboutScreen from './src/screens/AboutScreen';
import { 
    REACT_APP_FIREBASE_API_KEY,
    REACT_APP_FIREBASE_AUTH_DOMAIN,
    REACT_APP_FIREBASE_DB_URL,
    REACT_APP_STORAGE_BUCKET,
    REACT_APP_PROJECT_ID
} from 'react-native-dotenv'

// Initialize Firebase
const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: REACT_APP_FIREBASE_DB_URL,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  projectId: REACT_APP_PROJECT_ID,
};

firebase.initializeApp(firebaseConfig);

const AppNavigator = createStackNavigator({
    Loading: LoadingScreen,
    Login: LoginScreen,
    SignUp: SignUpScreen,
    Home: HomeScreen,
    Thread: ThreadScreen,
    CreateThread: CreateThreadScreen,
    Chat: ChatScreen,
    CreateChat: CreateChatScreen,
    SetUsername: SetUsernameScreen,
    About: AboutScreen
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
    constructor() {
        super();
        YellowBox.ignoreWarnings(['Setting a timer']);
        // console.ignoredYellowBox = ['Setting a timer'];
    }
    
    render() {
        return (
            <MenuProvider>
                <AppContainer/>
            </MenuProvider>
        )
  }
}