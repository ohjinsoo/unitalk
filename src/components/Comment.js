import React from 'react';
import {
    StyleSheet,
    View, 
    Text, 
    FlatList, 
    TextInput,
} from 'react-native';
import PostOptions from './PostOptions';
import * as firebase from 'firebase';
import Time from '../utils/Time'
import UserInfo from '../utils/UserInfo'

class Comment extends React.PureComponent {
    state = {
        comment: {},
        replies: [],
        editText: "",
        showEdit: false
    }
    userRef = firebase.firestore().collection("usernames").doc(firebase.auth().currentUser.displayName)

    refresh(props) {
        const comment = props.commentData
        if (comment.key == "") {
            this.postRef = null
            this.setState({
                comment: comment,
            })
        } else if (props.op) {
            this.postRef = firebase.firestore().collection("/" + UserInfo.getUni() + "/").doc(comment.key)
            this.setState({
                comment: comment,
                editText: comment.content
            })
        } else {
            this.postRef = props.postRef.doc(comment.key)
            this.repliesRef = firebase.firestore().collection("/" + UserInfo.getUni() + "/" + props.threadKey + "/comments/" + comment.key + "/replies/")
            if (this.repliesRef) {
                this.repliesRef.orderBy("time").get().then(querySnapshot => {
                    let replies = []
                    querySnapshot.forEach(doc => {
                        let reply = doc.data()
                        reply.key = doc.id
                        reply.timeText = Time.getTime(reply.time, Date.now())
                        reply.liked = UserInfo.getLiked()[reply.key]
                        replies.push(reply)
                    })
                    this.setState({
                        comment: comment,
                        replies : replies,
                        editText: comment.content
                    })
                })
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.commentData != this.props.commentData) {
            this.refresh(this.props)
        }
    }

    componentDidMount() {
        this.refresh(this.props)
    }

    createReply(content) {
        const reply = {
            author: firebase.auth().currentUser.displayName,
            content: content,
            time: Date.now(),
            likes: 0,
            deleted: false,
            modified: false,
        };

        this.repliesRef.add(reply).then(doc => {
            reply.timeText = "0 secs"
            reply.key = doc.id
            this.setState(prevState => ({
                replies : [...prevState.replies, reply]
            }))
        }).catch((error)=>{
            console.log(error);
        })
    }

    toggleEdit() {
        this.setState(prevState => ({ showEdit: !prevState.showEdit }))
    }

    onEdit() {
        this.postRef.update({
            content: this.state.editText,
            modified: true
        })

        let prevComment = this.state.comment
        prevComment.content = this.state.editText
        prevComment.modified = true
        this.setState({
            comment: prevComment,
            showEdit: false
            
        })
    }

    onDel() {
        let del = {
            deleted: true,
            time: this.state.comment.time
        }
        
        if (this.props.op) {
            this.props.disableComments()
            this.postRef.delete()
        } else if (this.state.replies.length == 0) {
            this.props.deleteComment(this.state.comment)
            this.postRef.delete()
        } else {
            this.postRef.set(del)
        }

        this.setState({comment: del})
    }

    deleteReply(delReply) {
        let replies = []
        for (let i = 0; i < this.state.replies.length; i++) {
            let reply = this.state.replies[i]
            if (delReply.key != reply.key) {
                replies.push(reply)
            }
        }
        this.setState({
            replies: replies
        })

        if (this.state.comment.deleted && replies.length == 0) {
            this.props.deleteComment(this.state.comment)
            this.postRef.delete()
        }
    }

    render() {
        let modified = ""
        const comment = this.state.comment
        const contentArea = this.state.showEdit 
                            ?   <TextInput style={this.props.op ? styles.mainContentText : styles.contentText}
                                value={this.state.editText}
                                multiline={true} 
                                onChangeText={(editText) => this.setState({ editText : String(editText) })}/>
                            :   <Text style={this.props.op ? styles.mainContentText : styles.contentText}>
                                    {comment.content}
                                </Text>

        if (comment.deleted) {
            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.contentText}>
                            (deleted)
                        </Text>
                    </View>
                    <FlatList
                    data={this.state.replies}
                    renderItem={reply => {
                        return (
                            <View style={styles.replyList}>
                                <View style={styles.verticalLine} />
                                <Comment deleteComment={(reply) => this.deleteReply(reply)} postRef={this.repliesRef} commentData={reply.item} />
                            </View>
                        )
                    }}>
                </FlatList>
                </View>
            )
        }

        if (this.props.op) {
            return (
                <View style={styles.originalPost}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {comment.title}
                        </Text>
                    </View>
                    <View style={styles.mainMetadata}>
                        <Text> 
                            submitted by {comment.author} {modified}
                        </Text>
                        <Text>
                            {comment.timeText}
                        </Text>
                    </View>
                    {contentArea}
                    <PostOptions    onEdit={() => this.onEdit()}
                                    toggleEdit={() => this.toggleEdit()} 
                                    showEdit={this.state.showEdit}
                                    onDel={() => this.onDel()} 
                                    postRef={this.postRef} 
                                    commentData={comment} 
                                    repliesData={this.state.replies} 
                                    createReply={content => this.createReply(content)}/>
                </View>
            )
        }

        if (comment.modified) {
            modified = "(edited)"
        }
        return (
            <View style={styles.container}>
                <View style={styles.metadata}>
                    <Text>
                        {comment.author} |  {comment.timeText} {modified}
                    </Text>
                </View>
                <View style={styles.content}>
                    {contentArea}
                </View>
                <PostOptions    onEdit={() => this.onEdit()}
                                toggleEdit={() => this.toggleEdit()} 
                                showEdit={this.state.showEdit}
                                onDel={() => this.onDel()} 
                                postRef={this.postRef} 
                                commentData={comment} 
                                repliesData={this.state.replies} 
                                createReply={content => this.createReply(content)}/>
                <FlatList
                    data={this.state.replies}
                    renderItem={reply => {
                        return (
                            <View style={styles.replyList}>
                                <View style={styles.verticalLine} />
                                <Comment deleteComment={(reply) => this.deleteReply(reply)} postRef={this.repliesRef} commentData={reply.item} />
                            </View>
                        )
                    }}>
                </FlatList>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        padding: 5,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        marginBottom: 5,
        flex: 1,
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
    replyList: {
        flexDirection: "row",
    },
    verticalLine: {
        borderLeftColor: "#8D8D8D",
        borderLeftWidth: 1,
        marginHorizontal: 5,
    },
    originalPost: {
        padding: 15,
        marginBottom: 15,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        
        elevation: 3,
    },
    mainMetadata: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 15
    },
    mainContentText: {
        fontSize: 16,
        marginBottom: 100,
    },
    header: {
        lineHeight: 1.5,
    },
    title: {
        fontSize: 32,
    },
});

export default Comment;