import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';

const ThreadCard = props => {
    threadData = props.data;
    const MAX_CONTENT_LENGTH = 40
    let threeDots = "..."
    if (threadData.content.length < MAX_CONTENT_LENGTH) {
        threeDots = null
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {threadData.title}
                </Text>
            </View>
            <View style={styles.metadata}>
                <Text>
                    submitted by {threadData.author}
                </Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.contentText}>
                    {threadData.content.substring(0, MAX_CONTENT_LENGTH)}{threeDots}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 7,
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF',
    },
    header: {
        lineHeight: 1.5,
    },
    title: {
        fontSize: 28,
    },
    content: {
        lineHeight: 1.5,
    },
    contentText: {
        fontSize: 16,
        marginBottom: 25
    },
    metadata: {
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 15
    },
});

export default ThreadCard;