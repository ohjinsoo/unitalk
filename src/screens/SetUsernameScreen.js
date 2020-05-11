import React, { setState } from 'react';
import { 
    StyleSheet,
    View,
    TextInput,
    Button,
    BackHandler,
    Text,
    ScrollView
} from 'react-native';
import * as firebase from 'firebase';
import * as data from '../utils/university.json';
import UserInfo from '../utils/UserInfo'
import { NavigationActions } from 'react-navigation';

class SetUsernameScreen extends React.Component {
    static navigationOptions = {
        title: "Set your username"
    }

    state = {
        username: "",
        invalidUsername: ""
    }

    namesRef = firebase.firestore().collection("usernames")

    componentDidMount() {
        BackHandler.addEventListener('backPress', function() {
            firebase.auth().signOut()
        })
    }

    render() {
        let user = firebase.auth().currentUser
        const { reset } = this.props.navigation;
        return (
            <View style={styles.container}>
                <ScrollView keyboardShouldPersistTaps="always">
                <Text style={styles.headerText}>Set your Username</Text>
                <TextInput  placeholder="Username" 
                            onChangeText={text => this.setState({ username: text })} 
                            value={this.state.username} 
                            style={styles.username} />
                <View style={styles.button}>
                    <Button title="Create" onPress={() => {
                        this.namesRef.doc(this.state.username).get().then(doc => {
                            if (doc.exists) {
                                this.setState({ invalidUsername: "Username already exists" })
                            } else {
                                const emailAddress = user.email.split('@')
                                const uni = data[emailAddress[1]]
                                this.namesRef.doc(this.state.username).set({
                                    uni: uni[0],
                                    liked: {}
                                })
                                UserInfo.setUni(uni[0])
                                UserInfo.setLiked({})
                                user.updateProfile({
                                    displayName: this.state.username
                                }).then(function() {
                                    reset([NavigationActions.navigate({ 
                                        routeName: "Home",
                                    })], 0);
                                })
                            }
                        })
                    }}/>
                </View>
                <Text style={styles.badUser}>{this.state.invalidUsername}</Text>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: 15,
    },
    headerText: {
        fontSize: 40,
        paddingTop: 150,
        textAlign: 'center',
        flex: 0.5
    },
    username: {
        marginVertical: 15,
        flex: 0.1,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    button: {
        flex: 0.1
    },
    badUser: {
        textAlign: 'center',
        color: "#EE3030",
        flex: 0.1
    }
});

export default SetUsernameScreen;