import React, { setState } from 'react';
import { 
    StyleSheet,
    View,
    TextInput,
    Text,
    ScrollView,
    Button
} from 'react-native';
import * as firebase from 'firebase';
class CreateThreadScreen extends React.Component {
    static navigationOptions = {
        title: "Create a new Chat"
    }

    state = {
        username: "",
        invalidUsername: ""
    }

    userChatsRef = firebase.firestore().collection("/usernames/" + firebase.auth().currentUser.displayName + "/chats/")
    otherUserRef = firebase.firestore().collection("usernames")
    render() {
        let createChat = this.props.navigation.state.params
        const { goBack } = this.props.navigation;
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.headerText}>Create a Chat</Text>
                <TextInput  placeholder="Other Username" 
                            onChangeText={text => this.setState({ username: text })} 
                            value={this.state.username} 
                            style={styles.otherUser} />
                <Button title="Create" style={styles.button} onPress={() => {
                    if (this.state.username == firebase.auth().currentUser.displayName) {
                        this.setState({ invalidUsername: "You cannot create chat with yourself" })
                    } else {
                        this.userChatsRef.doc(this.state.username).get().then(doc => {
                            if (doc.exists) {
                                this.setState({ invalidUsername: "Chat already exists" })
                            } else {
                                this.otherUserRef.doc(this.state.username).get().then(doc => {
                                    if (doc.exists) {
                                        createChat(this.state.username)
                                        goBack()
                                    } else {
                                        this.setState({ invalidUsername: "Invalid User" })
                                    }
                                })
                            }
                        })
                    }
                }}/>
                <Text style={styles.badUser}>{this.state.invalidUsername}</Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: 10,
    },
    headerText: {
        fontSize: 40,
        marginVertical: 75,
        textAlign: 'center',
    },
    otherUser: {
        marginVertical: 15,
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 5
    },
    button: {
        margin: 20,
        flex: 0.3,
    },
    badUser: {
        textAlign: 'center',
        color: "#EE3030",
        flex: 0.1
    }
});

export default CreateThreadScreen;