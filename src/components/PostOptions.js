import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, Clipboard} from 'react-native';
import DropDownMenu from '../components/DropDownMenu'
import CommentToolbar from './CommentToolbar';
import * as firebase from 'firebase';
import UserInfo from '../utils/UserInfo';

const PostOptions = props => {
    const commentData = props.commentData
    const repliesData = props.repliesData

    const user = firebase.auth().currentUser
    const owner = user.displayName == commentData.author
    const disableReply = commentData.showReply ? "flex" : "none"

    const [replyField, replyFieldHandler] = useState(true);
    const [likeColor, likeColorHandler] = useState("black");
    if (owner && likeColor != "#868686") {
        likeColorHandler("#868686")
    } else if (commentData.liked && likeColor != "blue") {
        likeColorHandler("blue")
    }
    
    const userRef = firebase.firestore().collection("usernames").doc(firebase.auth().currentUser.displayName)

    let likes = "Like"
    let replies = "Reply"

    if (commentData.likes == 1) {
        likes = "1 Like"
    } else if (commentData.likes > 1) {
        likes = commentData.likes + " Likes"
    }

    if (repliesData == null) {
        replies = null
    } else if (repliesData.length == 1) {
        replies = "1 Reply"
    } else if (repliesData.length > 1) {
        replies = repliesData.length + " Replies"
    }

    let editButton = null
    if (props.showEdit) {
        editButton = <>
                        <TouchableOpacity onPress={props.toggleEdit} style={styles.touchable}>
                            <Text>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={props.onEdit} style={styles.touchable}>
                            <Text>
                                Edit
                            </Text>
                        </TouchableOpacity>
                    </>
    }

    onLike = function() {
        let update = {}
        const key = "liked." + commentData.key
        update[key] = !commentData.liked
        userRef.update(update)
        let inc = commentData.liked ? -1 : 1
        commentData.likes += inc
        props.postRef.update({
            likes: firebase.firestore.FieldValue.increment(inc)
        })

        let liked = UserInfo.getLiked()
        liked[commentData.key] = update[key]
        UserInfo.setLiked(liked)

        commentData.liked = !commentData.liked
        likeColorHandler(commentData.liked ? "blue" : "black")
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior="height" enabled keyboardVerticalOffset={0}>
            <View style={styles.container}>
                {editButton}
                <DropDownMenu copyText={() => Clipboard.setString(commentData.content)} toggleEdit={props.toggleEdit} onDel={props.onDel} owner={owner}/>
                <TouchableOpacity style={[styles.touchable, {display: disableReply}]} onPress={() => replyFieldHandler(!replyField)}>
                    <Text>
                        {replies}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={owner} onPress={onLike} style={styles.touchable}>
                    <Text style={{color: likeColor}}>
                        {likes}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.commentBar}>
                <CommentToolbar hide={replyField} createComment={content => props.createReply(content)}/>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 0.2,
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    touchable: {
        width: 75,
        alignItems: "center"
    },
    commentBar: {
        marginTop: 5
    }
});

export default PostOptions;

/*
import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import DropDownMenu from '../components/DropDownMenu'
import CommentToolbar from './CommentToolbar';
import * as firebase from 'firebase';

const PostOptions = props => {
    const commentData = props.commentData;
    const repliesData = props.repliesData
    const user = firebase.auth().currentUser
    const postRef = props.postRef
    const owner = user.displayName == commentData.author

    const [likes, likesHandler] = useState("");
    const [replies, repliesHandler] = useState("");
    const [likeColor, likeColorHandler] = useState("black");
    const [disableReply, disableReplyHandler] = useState("none");
    const [replyField, replyFieldHandler] = useState(true);
    const userRef = firebase.firestore().collection("usernames").doc(firebase.auth().currentUser.displayName)

    useEffect(() => {
        if (commentData.likes == 0) {
            likesHandler("Like")
        } else if (commentData.likes == 1) {
            likesHandler("1 Like")
        } else if (commentData.likes > 1) {
            likesHandler(commentData.likes + " Likes")
        }
    
        if (repliesData == null) {
            repliesHandler(null)
        } else if (repliesData.length == 0) {
            repliesHandler("Reply")
        } else if (repliesData.length == 1) {
            repliesHandler("1 Reply")
        } else if (repliesData.length > 1) {
            repliesHandler(repliesData.length + " Replies")
        }

        likeColorHandler(owner ? "#868686" : (commentData.liked ? "blue" : "black"))
        disableReplyHandler(commentData.showReply ? "flex" : "none")
    });
    
    onLike = function() {
        let update = {}
        const key = "liked." + commentData.key
        update[key] = !commentData.liked
        userRef.update(update)
        let inc = commentData.liked ? -1 : 1
        commentData.likes += inc
        postRef.update({
            likes: firebase.firestore.FieldValue.increment(inc)
        })

        commentData.liked = !commentData.liked
        likeColorHandler(commentData.liked ? "blue" : "black")
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior="height" enabled keyboardVerticalOffset={0}>
            <View style={styles.container}>
                <DropDownMenu owner={owner}/>
                <TouchableOpacity style={[styles.touchable, {display: disableReply}]} onPress={() => replyFieldHandler(!replyField)}>
                    <Text>
                        {replies}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onLike} style={styles.touchable}>
                    <Text style={{color: likeColor}}>
                        {likes}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.commentBar}>
                <CommentToolbar hide={replyField} createComment={content => props.createReply(content)}/>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 0.2,
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    touchable: {
        width: 75,
        alignItems: "center"
    },
    commentBar: {
        marginTop: 5
    }
});

export default PostOptions;
*/