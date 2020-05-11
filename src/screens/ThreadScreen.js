import React from 'react';
import { 
    StyleSheet, 
    View, 
    FlatList, 
    ScrollView, 
    KeyboardAvoidingView, 
    Platform, 
} from 'react-native';
import Comment from '../components/Comment'
import CommentToolbar from '../components/CommentToolbar'
import * as firebase from 'firebase';
import Time from '../utils/Time'
import UserInfo from '../utils/UserInfo'
import { BannerView } from 'react-native-fbads';
import { REACT_APP_FACEBOOK_ID } from 'react-native-dotenv'

class ThreadScreen extends React.Component {
    state = {
        op: {
            key: "",
        },
        disabled: false,
        comments: [],
    };

    user = firebase.auth().currentUser.displayName
    propState = this.props.navigation.state;
    
    commentRef = firebase.firestore().collection("/" + UserInfo.getUni()  + "/" + this.propState.params.key + "/comments/")
    threadRef = firebase.firestore().collection(UserInfo.getUni()).doc(this.propState.params.key)
    userRef = firebase.firestore().collection("usernames").doc(this.user)

    componentDidMount() {
        const key = this.propState.params.key
        let opLiked = false
        const liked = UserInfo.getLiked()
        opLiked = liked[key] == null ? false : liked[key]
        this.threadRef.get().then(opDoc => {
            this.commentRef.orderBy("time").get().then(querySnapshot => {
                let op = opDoc.data();
                if (op == null) {
                    this.setState({
                        op: {
                            key: "",
                            deleted: true
                        }
                    })
                } else {
                    let curr = Date.now();
                    op.key = key
                    op.timeText = Time.getTime(op.time, curr);
                    op.liked = opLiked
                    let comments = [];
        
                    querySnapshot.forEach(doc => {
                        let comment = doc.data();
                        comment.key = doc.id
                        comment.timeText = Time.getTime(comment.time, curr)
                        comment.liked = liked[comment.key] == null ? false : liked[comment.key]
                        comment.showReply = true
                        comments.push(comment)
                    });
                    
                    op.commentAmount = comments.length
                    this.setState({
                        op: op,
                        comments: comments,
                    })
                }
            });
        })
    }

    createComment(content) {
        const comment = {
            author: this.user,
            content: content,
            time: Date.now(),
            likes: 0,
            modified: false,
            deleted: false,
        };

        this.commentRef.add(comment).then(doc => {
            comment.timeText = "0 sec"
            comment.key = doc.id
            comment.showReply = true
            this.setState(prevState => ({
                comments: [...prevState.comments, comment]
            }))
        }).catch((error)=>{
            console.log(error);
        })
    }

    deleteComment(delComment) {
        let comments = []
        for (let i = 0; i < this.state.comments.length; i++) {
            let comment = this.state.comments[i]
            if (delComment.key != comment.key) {
                comments.push(comment)
            }
        }

        this.setState({
            comments: comments
        })
    }

    disableComments() {
        this.setState({
            disabled: true
        })
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior={Platform.Os == "ios" ? "padding" : "height"} enabled keyboardVerticalOffset={100}>
                <View style={styles.mainCommentList}>
                    <FlatList
                        ListHeaderComponent={
                            <Comment disableComments={() => this.disableComments()} deleteComment={(comment) => this.deleteComment(comment)} op={true} commentData={this.state.op} />
                        }
                        keyboardShouldPersistTaps="always"
                        data={this.state.comments}
                        renderItem={({item, index}) => {
                            const comment = item
                            let ad = null
                            if (index % 5 == 0) {
                                ad = 
                                    <View>
                                        <View style={styles.ads}/>
                                        <BannerView
                                        placementId={REACT_APP_FACEBOOK_ID}
                                        type="rectangle"
                                        onPress={() => console.log('click')}
                                        onError={err => console.log('error', err)}
                                        />
                                        <View style={styles.ads}/>
                                    </View>
                            }
                            return (
                                <View style={styles.comment}>
                                    <Comment deleteComment={(comment) => this.deleteComment(comment)} postRef={this.commentRef} commentData={comment} threadKey={this.state.op.key}/>
                                    {ad}
                                </View>
                            )
                        }}>
                    </FlatList>
                </View>
                <CommentToolbar hide={this.state.disabled} border={true} createComment={content => this.createComment(content)}/>
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
    scrollView: {
        backgroundColor: '#ddd',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    mainCommentList: {
        flex: 1,
        alignItems: 'stretch',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    comment: {
        marginBottom: 5
    },
    ads: {
        backgroundColor: "white",
        height: 8
    },
});

export default ThreadScreen;