import React, {useState} from 'react';
import { 
    StyleSheet, 
    View, 
    Text,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    FlatList,
} from 'react-native';
import '@firebase/firestore';
import ThreadCard from '../components/ThreadCard'
import { BannerView } from 'react-native-fbads';
import { REACT_APP_FACEBOOK_ID } from 'react-native-dotenv'
import UserInfo from '../utils/UserInfo'
import * as firebase from 'firebase';

const MainPage = props => {
    const [refreshing, refreshingHandler] = useState(false);
    let threadArr = []
    for (let id in props.threads) {
        threadArr.push(props.threads[id])
    }
    threadArr = threadArr.reverse()

    return (
            <FlatList   style={styles.container} 
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                        onEndReached={() => props.loadMore()}
                        onEndReachedThreshold={0.05}
                        initialNumToRender={5}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={function() {
                                refreshingHandler(true)
                                props.refreshData()
                                refreshingHandler(false)
                            }} />
                        }
                        ListHeaderComponent={
                            <View style={[styles.card, styles.header]} >
                                <Text style={styles.headerText} >
                                    Welcome {firebase.auth().currentUser.displayName}
                                    {"\n\n"}
                                    School: {UserInfo.getUni()}
                                </Text>
                            </View>
                        }
                        ListFooterComponent={
                            <Text style={styles.footer}>
                                no more threads to load
                            </Text>
                        }
                        data={threadArr}
                        renderItem={({item, index}) => {
                            let thread = item
                            let ad = null
                            if (index % 5 == 0) {
                                ad =    <View style={styles.card} >
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
                                <>
                                    <View key={index} style={styles.card} >
                                        <TouchableOpacity onPress={() => props.navigate('Thread', thread)}>
                                            <ThreadCard data={thread}/>
                                        </TouchableOpacity>
                                    </View>
                                    {ad}
                                </>
                            );
                        }}/>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        backgroundColor: '#ddd',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    header: {
        padding: 50,
    },
    headerText: {
        fontSize: 20,
        textAlign: "center"
    },
    ads: {
        height: 15
    },
    card: {
        backgroundColor: "white",
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    footer: {
        borderBottomColor: "gray",
        borderBottomWidth: 1,
        fontSize: 20,
        textAlign: "center",
        margin: 60,
        fontWeight: 'bold'
    }
});

export default MainPage;