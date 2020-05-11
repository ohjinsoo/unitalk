import React, {useState} from "react";
import {
    StyleSheet, 
    Text, 
    View, 
    TextInput,  
    ScrollView, 
    Button,
} from 'react-native';
import * as firebase from 'firebase';
import UserInfo from '../utils/UserInfo'
import { NavigationActions } from 'react-navigation';
import Toast from 'react-native-easy-toast'

const Login = props => {
    const [email, emailHandler] = useState("");
    const [password, passwordHandler] = useState("");
    const [badLogin, badLoginHandler] = useState("");
    let toast = null
    
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.logoText}>unitalk</Text>
            <TextInput onChangeText={emailHandler} value={email} placeholder="Email" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} />
            <TextInput onChangeText={passwordHandler} value={password} placeholder="Password" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} secureTextEntry={true}/>
            <Button
            buttonStyle={styles.loginButton}
            onPress={function() {
                var valid = "valid";
                firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                    valid = error.code;
                }).then(function() {
                    if (valid == "valid") {
                        const user = firebase.auth().currentUser
                        if (!user.emailVerified) {
                            badLoginHandler("Email has not been verified yet.")
                        } else if (user.displayName == null) {
                            props.navigate("SetUsername")
                        } else {
                            let userRef = firebase.firestore().collection("usernames").doc(user.displayName)
                            userRef.get().then((doc) => {
                                UserInfo.setUni(doc.data().uni)
                                UserInfo.setLiked(doc.data().liked)
                                props.reset([NavigationActions.navigate({ 
                                    routeName: "Home",
                                })], 0);
                            })
                        }
                    } else if (valid == "auth/user-disabled") {
                        badLoginHandler("Email has been disabled.")
                    } else if (valid == "auth/invalid-email") {
                        badLoginHandler("Email is invalid.")
                    } else if (valid == "auth/user-not-found") {
                        badLoginHandler("Email not found")
                    } else if (valid == "auth/wrong-password") {
                        badLoginHandler("Incorrect Password")
                    }
                });
            }}
            title="Login"
            />
            <Button
            buttonStyle={styles.signUpButton}
            onPress={() => props.navigate("SignUp", toast)}
            title="Sign Up"
            color="#3897f1"
            />
            <Toast position="top" ref={ref => toast = ref}/>
            <Text style={styles.badLoginText}>{badLogin}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        flexDirection: 'column',
    },
    logoText: {
        fontSize: 40,
        fontWeight: "800",
        marginVertical: 75,
        textAlign: 'center',
        flex: 0.3
    },
    loginFormTextInput: {
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eaeaea',
        backgroundColor: '#fafafa',
        paddingLeft: 10,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 5,
        height: 40,
    },
    loginButton: {
        backgroundColor: '#3897f1',
        borderRadius: 5,
        height: 45,
        marginTop: 10,
        flex: 0.05
    },
    signUpButton: {
        height: 45,
        marginTop: 10,
        backgroundColor: 'transparent',
        flex: 0.05
    },
    badLoginText: {
        marginTop: 15,
        height: 45,
        textAlign: 'center',
        color: "#EE3030",
        flex: 0.3
    },
})

export default Login;