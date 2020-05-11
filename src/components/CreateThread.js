import React, {useState} from 'react';
import { 
    StyleSheet,
    View,
    TextInput,
    Button,
    Text,
    ScrollView
} from 'react-native';
import { NavigationActions } from 'react-navigation';

const CreateThread = props => {
    const [threadName, setThreadName] = useState("");
    const [threadContent, setThreadContent] = useState("");
    const [badThreadCreation, badThreadCreationHandler] = useState("");

    const titleHandler = (changedText) => {
        setThreadName(changedText);
    };
    const contentHandler = (changedText) => {
        setThreadContent(changedText);
    };
    
    return (
        <ScrollView style={styles.createThreadView}>
            <TextInput placeholder="Title" onChangeText={titleHandler} value={threadName} style={styles.titleInput} />
            <TextInput placeholder="Enter text here."  numberOfLines={10} onChangeText={contentHandler} value={threadContent} multiline={true} style={styles.contentInput} />
            <View style={styles.button}>
                <Button title="ADD" onPress={function() {
                    if (threadName.length == 0) {
                        badThreadCreationHandler("You must have a title.")
                    } else if (threadName.length > 50) {
                        badThreadCreationHandler("The title cannot be longer than 50 characters.")
                    } else if (threadContent > 1000) {
                        badThreadCreationHandler("The content cannot be longer than 1000 characters.")
                    } else {
                        props.onCreateThread(threadName, threadContent)
                        props.reset([NavigationActions.navigate({ 
                            routeName: "Home",
                        })], 0);
                    }
                }}/>
            </View>
            <Text style={styles.badThreadCreationText}>{badThreadCreation}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    createThreadView: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: 10,
    },
    titleInput: {
        marginVertical: 15,
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 5
    },
    contentInput: {
        color: '#000',
        padding: 5,
        height: 200,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    button: {
        margin: 20,
        flex: 0.3,
    },
    badThreadCreationText: {
        textAlign: 'center',
        color: "#EE3030",
        flex: 0.1
    }
});

export default CreateThread;