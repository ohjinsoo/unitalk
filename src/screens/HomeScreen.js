import React from 'react';
import { 
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Dimensions,
    Animated,
    Image,
    TouchableOpacity
} from 'react-native';
import firebase from 'firebase'
import '@firebase/firestore';
import MainPage from '../components/MainPage'
import HomeToolbar from '../components/HomeToolbar';
import SettingsPage from '../components/SettingsPage';
import UserInfo from '../utils/UserInfo'
import ChatsPage from '../components/ChatsPage';

class HomeScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Home",
        headerRight: () =>
        <TouchableOpacity onPress={function() {
            navigation.navigate("CreateThread")
        }}>
            <Image style={styles.image} source={require('../assets/post.png')}/>
        </TouchableOpacity>,
    });

    state = {
        loading: true,
        user: null,
        threads: {},
        chats: [],
        scrollX: new Animated.Value(0),
        scrollY: 0,
        currentDisplay: 0
    };


    chatsRef = firebase.firestore().collection("chats")
    userRef = firebase.firestore().collection("/usernames/").doc(firebase.auth().currentUser.displayName)
    userChatsRef = this.userRef.collection("/chats/")
    threadIdsRef = firebase.firestore().collection(UserInfo.getUni());
    navigate = this.props.navigation.navigate;
    replace = this.props.navigation.replace;
    windowWidth = Dimensions.get('window').width;
    scrollView = null;
    
    tempState = []
    lastThread = null
    unsubscribe = this.threadIdsRef
        .orderBy("time")
        .limit(5)
        .onSnapshot(snapshot => {
            let temp = this.tempState
            this.lastThread = snapshot.docs[snapshot.docs.length-1];
            snapshot.docChanges().forEach(function(change) {
                data = change.doc.data()
                id = change.doc.id
                if (change.type === "removed" || data.deleted) {
                    if (temp[id]) {
                        delete temp[id]
                    }
                } else {
                    temp[id] = {
                        key: id,
                        title: data.title,
                        author: data.author,
                        time: data.time,
                        likes: data.likes,
                        content: data.content,
                    }
                }
            });
            if (this.state.loading) {
                this.setState({
                    threads: temp,
                    loading: false
                });
            }

            this.tempState = temp
        });

    onPress(offset) {
        this.scrollView.scrollTo({x: offset * this.windowWidth})
    }

    signOut() {
        this.unsubscribe()
        let replace = this.replace
        firebase.auth().signOut().then(function() {
            replace("Login")
        })
    }

    deleteAccount() {
        this.unsubscribe()
        let replace = this.replace
        this.userRef.delete().then(function() {
            firebase.auth().currentUser.delete().then(function() {
                replace("Login")
            })
        })
    }

    componentDidMount() {
        this.userChatsRef.get().then(querySnapshot => {
            let chats = []
            querySnapshot.forEach(doc => {
                let chat = {}
                chat.id = doc.id
                chat.key = doc.data().chatKey
                chats.push(chat)
            })
            this.setState({ chats: chats })
        })
    }

    createChat(user) {
        this.chatsRef.add({
            messages: []
        }).then(doc => {
            this.userChatsRef.doc(user).set({
                chatKey: doc.id
            })
            
            firebase.firestore().collection("/usernames/" + user + "/chats/").doc(firebase.auth().currentUser.displayName).set({
                chatKey: doc.id
            })

            let chat = {}
            chat.id = user
            chat.key = doc.id
            this.setState(prevState => ({
                chats: [chat, ...prevState.chats]
            }))
        })
    }
    
    loadMore() {
        this.threadIdsRef
            .orderBy("time", "desc")
            .startAfter(this.lastThread)
            .limit(5)
            .get()
            .then(querySnapshot => {
                let temp = this.tempState
                let prev = this.state.threads
                querySnapshot.forEach(doc => {
                    this.lastThread = doc
                    let data = doc.data()
                    let id = doc.id
                    let thread = {
                        key: id,
                        title: data.title,
                        author: data.author,
                        time: data.time,
                        likes: data.likes,
                        content: data.content,
                    }
                    temp[id] = thread
                    prev[id] = thread
                })
                this.tempState = temp
                this.setState({
                    threads: prev
                })
            })
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled keyboardVerticalOffset={100}>
                <ScrollView 
                    ref={ref => this.scrollView = ref}
                    style={styles.horizontalScroll}
                    horizontal= {true}
                    disableIntervalMomentum={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    onScroll={
                        Animated.event(
                            [{nativeEvent: {contentOffset: {x: this.state.scrollX}}}], {
                                listener: event => {
                                    let currentDisplay = 0
                                    const x = event.nativeEvent.contentOffset.x
                                    if (x > this.windowWidth + this.windowWidth/2) {
                                        currentDisplay = 2
                                    } else if (x > this.windowWidth/2) {
                                        currentDisplay = 1
                                    }
                                    if (this.state.currentDisplay != currentDisplay) {
                                        this.setState({ currentDisplay: currentDisplay })
                                    }
                                }
                            })
                    }
                    scrollEventThrottle={64}>
                    <MainPage navigate={this.navigate} refreshData={() => this.setState({threads: this.tempState})} loadMore={() => this.loadMore()} threads={this.state.threads} />
                    <ChatsPage navigate={this.navigate} createChat={user => this.createChat(user)} chats={this.state.chats} />
                    <SettingsPage navigate={this.navigate} signOut={() => this.signOut()} deleteAccount={() => this.deleteAccount()}/>
                </ScrollView>
                <HomeToolbar currentDisplay={this.state.currentDisplay} onPress={(offset) => this.onPress(offset)} onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    this.setState({
                        scrollY: layout.y,
                    })
                }} />
                <Animated.View style={[styles.scrollIndicator, {
                    left: Animated.divide(this.state.scrollX, 3),
                    top: this.state.scrollY,
                    width: this.windowWidth/3
                }]}/>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        flexDirection: 'column',
        justifyContent: 'center',
    },
    horizontalScroll: {
        flexDirection: 'row',
        flex: 1
    },
    scrollIndicator: {
        borderTopColor: "#FF8700",
        borderTopWidth: 3,
        position: "absolute",
        opacity: 50,
        borderRadius: 10
    },
    image: {
        marginRight: 22,
        width: 30,
        height: 30
    },
});

export default HomeScreen;