import React from 'react';
import CreateThread from '../components/CreateThread';
import firebase from 'firebase'
import UserInfo from '../utils/UserInfo'

class CreateThreadScreen extends React.Component {
    static navigationOptions = {
        title: "Create a Thread"
    }

    threadIdsRef = firebase.firestore().collection(UserInfo.getUni())

    addThreadHandler = function(title, content) {
        this.threadIdsRef.add({
            title: title,
            content: content,
            author: firebase.auth().currentUser.displayName,
            time: Date.now(),
            likes: 0,
            deleted: false,
            modified: false
        })
    }

    render() {
        const { reset } = this.props.navigation;
        return (
            <CreateThread uni={this.uni} reset={reset} onCreateThread={(title, content) => this.addThreadHandler(title, content)} />
        );
    }
}

export default CreateThreadScreen;