import React from 'react';
import SignUp from '../components/SignUp';

class SignUpScreen extends React.Component {

    showToast() {
        this.props.navigation.state.params.show("A confirmation email has been sent.", 6000)
    }

    render() {
        const { goBack } = this.props.navigation;
        return (
            <SignUp showToast={() => this.showToast()} goBack={goBack}/>
        );
    }
}

export default SignUpScreen;