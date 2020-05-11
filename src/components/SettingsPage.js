import React, {useState} from 'react';
import { 
    StyleSheet, 
    View,
    Dimensions, 
    Text,
    TouchableOpacity
} from 'react-native';
import '@firebase/firestore';

const SettingsPage = props => {
    return (
        <View style={styles.container}>
            <Text style={styles.settingsText}>
                Other
            </Text>
            
            <TouchableOpacity style={styles.touchable} onPress={() => props.navigate("About")}>
                <Text style={styles.text}>
                    About
                </Text>
            </TouchableOpacity> 
            
            <TouchableOpacity style={styles.touchable} onPress={props.signOut}>
                <Text style={styles.text}>
                    Sign Out
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.touchable} onPress={props.deleteAccount}>
                <Text style={styles.deleteText}>
                    Delete Account
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    touchable: {
        backgroundColor: "#f9f9f9",
        borderTopColor: '#eee',
        borderBottomColor: '#eee',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginVertical: 15,
        flex: 0.1,
        justifyContent: "center"
    },
    settingsText: {
        fontSize: 40,
        flex: 0.4,
        textAlign: "center",
        marginTop: 100,
    },
    text: {
        textAlign: "center",
        textAlignVertical: "center",
    },
    deleteText: {
        textAlign: "center",
        textAlignVertical: "center",
        color: "#EE3030"
    }
});

export default SettingsPage;