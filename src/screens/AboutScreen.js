import React from 'react';
import { 
    StyleSheet,
    Text,
    View
} from 'react-native';

class AboutScreen extends React.Component {

    render() {
        return (
            <View style={styles.container} >
                <Text style={styles.headerText} >
                    About
                </Text>

                <Text style={styles.mainContent} >
                    unitalk is an anonymous forum where university students can talk with peers from the 
                    same university. You may reply to each other's threads, comments, create chats to 
                    privately talk one on one, or delete your account.
                </Text>

                <Text style={styles.credit} >
                    Credits to the button images by Freepik @ www.flaticon.com
                </Text>

                <Text style={styles.credit} >
                    Est. 2020 by Jinsoo Oh
                </Text>
                
                <Text style={styles.credit} >
                    Contact: oh.jinsoo98@gmail.com
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: 20
    },
    headerText: {
        fontSize: 40,
        flex: 0.4,
        textAlign: "center",
        marginTop: 100,
    },
    mainContent: {
        fontSize: 15,
        marginVertical: 40
    },
    credit: {
        textAlign: "center",
        marginVertical: 20
    }

})

export default AboutScreen