import React from 'react';
import {
  ActivityIndicator,
  View,
} from 'react-native';
import * as firebase from 'firebase';
import UserInfo from '../utils/UserInfo'

class LoadingScreen extends React.Component {
    componentDidMount = () => {
        let replace = this.props.navigation.replace
        firebase.auth().onAuthStateChanged(function(user) {
            if (user && user.displayName) {
                let userRef = firebase.firestore().collection("usernames").doc(user.displayName)
                userRef.get().then((doc) => {
                    UserInfo.setUni(doc.data().uni)
                    UserInfo.setLiked(doc.data().liked)
                    replace("Home");
                })
            } else {
                replace("Login");
            }
          });
    }

    // Render any loading content that you like here
    render() {
        return (
            <View>
                <ActivityIndicator />
            </View>
        );
    }
}

export default LoadingScreen;