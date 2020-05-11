import React, {useState} from 'react';
import { 
    StyleSheet, 
    View, 
    FlatList,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import '@firebase/firestore';

const ChatsPage = props => {
    return (
        <View style={styles.container}>
            <FlatList
                data={props.chats}
                ListHeaderComponent={
                    <TouchableOpacity style={styles.header} onPress={() => props.navigate('CreateChat', props.createChat)}>
                        <Text style={{fontSize: 40}}>
                            Chats
                        </Text>
                        <Text>
                            Create a new chat
                        </Text>
                    </TouchableOpacity>
                }
                renderItem={chat => {
                    return (
                        <View>
                            <TouchableOpacity style={styles.chatCard} onPress={() => props.navigate('Chat', chat.item)}>
                                <Text style={styles.chatName}>
                                    {chat.item.id}
                                </Text>                                 
                            </TouchableOpacity>
                            <View style={styles.hr} />
                        </View>
                    )
                }}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    header: {
        marginVertical: 100,
        flex: 0.3,
        alignItems: 'center',
    },
    chatCard: {
        height: 75,
        paddingLeft: 15,
        justifyContent: "center",
        backgroundColor: "#eee"
    },
    chatName: {
        fontSize: 20
    },
    hr: {
        borderBottomColor: "#eee",
        borderBottomWidth: 1
    }
})

export default ChatsPage