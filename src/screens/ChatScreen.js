import React from 'react';
import { 
    StyleSheet,
    View,
    Text,
    FlatList,
    Platform,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import firebase from 'firebase'
import '@firebase/firestore';
import Time from '../utils/Time'
import CommentToolbar from '../components/CommentToolbar';

class ChatScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Chat w/ " + navigation.state.params.id,
    })

    state = {
        messages : []
    }

    propState = this.props.navigation.state;
    chatRef = firebase.firestore().collection("chats").doc(this.propState.params.key)

    componentDidMount() {
        this.chatRef.get().then(doc => {
            this.setState({messages: doc.data().messages})
        })
    }

    createMessage(content) {
        const message = {
            author: firebase.auth().currentUser.displayName,
            time: Date.now(),
            content: content,
        }

        this.chatRef.update({
            messages: firebase.firestore.FieldValue.arrayUnion(message)
        });

        this.setState(prevState => ({
            messages: [...prevState.messages, message]
        }))
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior={Platform.Os == "ios" ? "padding" : "height"} enabled keyboardVerticalOffset={100} >
                <View style={styles.messageList}>
                    <FlatList
                    data={this.state.messages}
                    keyExtractor={(item, idx) => idx.toString()}
                    renderItem={msg => {
                        const message = msg.item
                        let currTime = Date.now()
                        return (
                            <View style={styles.message}>
                                <Text style={styles.metadata}>
                                    {message.author} |  {Time.getTime(message.time, currTime)}
                                </Text>
                                <Text style={styles.contentText}>
                                    {message.content}
                                </Text>
                                <View style={styles.hr}/>
                            </View>
                        )
                    }}/>
                </View>
                <CommentToolbar border={true} createComment={content => this.createMessage(content)}/>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        flexDirection: 'column',
        justifyContent: 'center',
    },
    messageList: {
        flex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    message: {
        paddingTop: 2,
        paddingHorizontal: 5,
        backgroundColor: "#f9f9f9"
    },
    metadata: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginHorizontal: 10
    },
    content: {
        flex: 0.5,
        lineHeight: 1.5,
    },
    contentText: {
        fontSize: 16,
        marginHorizontal: 10,
        marginBottom: 25,
    },
    hr: {
        borderBottomColor: "#eee",
        borderBottomWidth: 1
    }
})

export default ChatScreen