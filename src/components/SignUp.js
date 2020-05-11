import React, {useState} from "react";
import {
    StyleSheet, 
    ScrollView, 
    Text, 
    View, 
    TextInput, 
    Button,
} from 'react-native';
import * as firebase from 'firebase';
import * as data from '../utils/university.json';

const SignUp = props => {
    const [email, emailHandler] = useState("");
    const [password, passwordHandler] = useState("");
    const [passwordConfirm, passwordConfirmHandler] = useState("");
    const [badSignUp, badSignUpHandler] = useState("");

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.logoText}>Sign Up</Text>
            <TextInput onChangeText={emailHandler} value={email} placeholder="Email" placeholderColor="#c4c3cb" style={styles.textInput} />
            <TextInput onChangeText={passwordHandler} value={password} placeholder="Password" placeholderColor="#c4c3cb" style={styles.textInput} secureTextEntry={true}/>
            <TextInput onChangeText={passwordConfirmHandler} value={passwordConfirm} placeholder="Confirm your Password" placeholderColor="#c4c3cb" style={styles.textInput} secureTextEntry={true}/>
            <Button
            buttonStyle={styles.button}
            onPress={function() {
                if (password == passwordConfirm) {
                    if (password.length >= 8) {
                        const emailAddress = email.split('@')
                        const uni = data[emailAddress[1]]
                        
                        if (uni == null) {
                            badSignUpHandler("Use a valid university email address to sign up.")
                        } else {
                            var valid = "valid";
                            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                                valid = error.code;
                            }).then(function() {
                                if (valid == "valid") {
                                    let user = firebase.auth().currentUser;
                                    user.sendEmailVerification().then(function() {
                                        props.showToast()
                                        props.goBack()
                                    })
                                } else if (valid == 'auth/invalid-email') {
                                    badSignUpHandler('Email is invalid.');
                                } else if (valid == 'auth/email-already-in-use') {
                                    badSignUpHandler('Email is already in use.');
                                }
                            });
                        }
                    } else {
                        badSignUpHandler("Password is not long enough.");
                    }
                } else {
                    badSignUpHandler("Passwords do not match.");
                }
            }}
            title="Sign Up"
            />
            <Text style={styles.badSignUpText}>{badSignUp}</Text>
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
    textInput: {
        fontSize: 14,
        borderRadius: 5,
        // borderWidth: 1,
        borderColor: '#eaeaea',
        backgroundColor: '#fafafa',
        paddingLeft: 10,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 5,
        height: 40
    },
    button: {
        backgroundColor: '#3897f1',
        borderRadius: 5,
        height: 45,
        marginTop: 10,
        flex: 0.05
    },
    badSignUpText: {
        marginTop: 15,
        height: 45,
        textAlign: 'center',
        color: "#EE3030",
        flex: 0.3
    },
})

export default SignUp;