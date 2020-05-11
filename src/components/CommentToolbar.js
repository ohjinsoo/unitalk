import React, {useState} from 'react';
import { StyleSheet, View, Button, TextInput, Keyboard} from 'react-native';

const CommentToolbar = props => {
    const [comment, commentHandler] = useState("");
    let border = props.border == null ? 0 : 1
    if (props.hide) {
        return null
    }

    return (
            <View style={[styles.container, { 
                borderTopWidth: border,
            }]}>
                <TextInput  multiline={true}
                            placeholder="Enter your comment." 
                            onChangeText={commentHandler} 
                            value={comment} 
                            style={styles.textInput}/>
                <View style={styles.button}>
                    <Button disabled={comment.length == 0} color='#02AF02' style={styles.button} onPress={() => {
                        props.createComment(comment);
                        commentHandler("")
                        Keyboard.dismiss();
                    }} title="Post"/>
                </View>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        flex: 0.1,
        backgroundColor: '#FDFDFD',
        borderTopColor: '#CFCFCF',
    },
    textInput: {
        flex: 6,
        padding: 5,
        borderColor: '#eee',
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
    },
    button: {
        flex:2,
        margin: 5,
    }
});

export default CommentToolbar;