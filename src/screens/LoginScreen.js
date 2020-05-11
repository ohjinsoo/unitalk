import React from 'react';
import Login from '../components/Login';
import {
    StyleSheet
} from 'react-native';
class LoginScreen extends React.Component {

    render() {
        const { reset, navigate } = this.props.navigation;
        return (
            <Login reset={reset} navigate={navigate}/>
        );
    }
}
export default LoginScreen;