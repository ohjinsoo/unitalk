import React from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity,
    Image
} from 'react-native';

class HomeToolbar extends React.Component {
    state = {
        home: null,
        chats: null,
        others: null
    }

    refresh() {
        const currentDisplay = this.props.currentDisplay
        let homeImage = currentDisplay == 0
                    ? <Image style={styles.image} source={require('../assets/onHome.png')}/>
                    : <Image style={styles.image} source={require('../assets/home.png')}/>

        let chatsImage = currentDisplay == 1
                        ? <Image style={styles.image} source={require('../assets/onChats.png')}/>
                        : <Image style={styles.image} source={require('../assets/chats.png')}/>

        let otherImage = currentDisplay == 2
                        ? <Image style={styles.image} source={require('../assets/onOther.png')}/>
                        : <Image style={styles.image} source={require('../assets/other.png')}/>

        this.setState({
            home: homeImage,
            chats: chatsImage,
            other: otherImage
        })
    }

    componentDidMount() {
        this.refresh()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentDisplay != this.props.currentDisplay) {
            this.refresh()
        }
    }

    render() {
        return (
                <View onLayout={this.props.onLayout} style={styles.container}>
                    <TouchableOpacity onPress={() => this.props.onPress(0)} style={styles.tab}>
                        {this.state.home}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.onPress(1)} style={styles.tab}>
                        {this.state.chats}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.onPress(2)} style={styles.tab}>
                        {this.state.other}
                    </TouchableOpacity>
                </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flex: 0.085,
        backgroundColor: '#FDFDFD',
        borderTopColor: '#CFCFCF',
        borderTopWidth: 1
    },
    tab: {
        flex: 2,
        padding: 15,
        alignItems: "center"
    },
    image: {
        width: 30,
        height: 30,
        overlayColor: "blue"
    },
});

export default HomeToolbar;