import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, FlatList, ActivityIndicator, Image, TouchableWithoutFeedback} from 'react-native';
import firebase from 'react-native-firebase'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import ChatsHandler from "../res/ChatsHandler";
import SingleChatHandler from "../res/SingleChatHandler";
import UserHandler from "../res/UserHandler";
import ConnectyCubeHandler from "../res/ConnectyCubeHandler";
import MessagesUpdatesHandler from "../res/MessagesUpdatesHandler";

function Loading(){
    return(
        <View style={styles.container}>
            <Text>Loading</Text>
            <ActivityIndicator size="large"/>
        </View>
    )
}

function Chat(props) {
    const lastMessageTime = props.getTime(props.item.createdAt)

    const Badge = ()=>(
        <View style = {styles.circle}></View>
    );

    return(
        <TouchableWithoutFeedback
            onPress={() => props.nav.navigate('SingleChat',
                {
                    chatId: props.item.chatId,
                    nameAndSurname: props.item.nameAndSurname,
                    urlPhotoOther: props.item.urlPhotoOther,
                    CCopponentUserId: props.item.CCopponentUserId,
                    userName: props.item.nameAndSurname
                })}>
            <View style={styles.singleChatContainer}>
                <Image
                    style={styles.userPhoto}
                    source={{uri: props.item.urlPhotoOther}}/>
                <View style={styles.singleChat}>
                    <View style={{flexDirection: "row", justifyContent:"space-between"}}>
                        <Text style={styles.text}>
                            {props.item.nameAndSurname}
                        </Text>
                        <Text>
                            {lastMessageTime}
                        </Text>
                    </View>
                    <View style={{flexDirection: "row", justifyContent:"space-between"}}>
                        <Text>
                            {props.item.lastMessageText}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default class AllChats extends Component {
    constructor(props){
        super(props)

        this.state = {
            chats: [],
            loadingDone: false
        }
    }

    static navigationOptions = () => {
        return {
            title: "Chat"
        };
    };

    componentWillUnmount(){
        MessagesUpdatesHandler.removeListeners(this.onMessageRcvd)
    }

    getTime = (createdAt) => {
        var utcSeconds = createdAt;
        var time = new Date(0); // The 0 there is the key, which sets the date to the epoch
        time.setUTCSeconds(utcSeconds);

        const now = new Date()
        let lastMessageTime = ""

        if(time.getDate() == now.getDate()){
            let minutes = 0;
            if (time.getMinutes() < 10){
                minutes = "0" + time.getMinutes()
            }else{
                minutes = time.getMinutes()
            }
            lastMessageTime = time.getHours() + ":" + minutes
        }else if(time.getDate() + 1== now.getDate()){
            lastMessageTime = "Ieri"
        }else{
            lastMessageTime = time.getDate() + "/" + (time.getMonth()+1) + "/" + time.getFullYear()
        }
        return lastMessageTime
    }

    onMessageRcvd = (msgRcvd, userId) => {
        this.setState(prevState => {
            var toUpdate = prevState.chats.filter((elem) => elem.CCopponentUserId == userId)[0]
            toUpdate.lastMessageText = msgRcvd.body
            toUpdate.createdAt = this.getTime(msgRcvd.date_sent)

            var otherChats = prevState.chats.filter((elem) => elem.CCopponentUserId != userId)
            if (otherChats.length == 0) allChats = [toUpdate]
            else allChats = [toUpdate, otherChats]
            return ({
                chats: allChats
            })
        })
    }


    componentDidMount(){
        MessagesUpdatesHandler.addListener(this.onMessageRcvd)
        ChatsHandler.getChats().then(chats => {
                this.setState({
                    chats: chats,
                    loadingDone: true
                })
            }
        )
    }

    render() {
        if(this.state.loadingDone != false){
            if(this.state.chats.length != 0) {
                return (
                    <FlatList
                        data={this.state.chats}
                        renderItem={
                            ({item}) => (
                                <Chat item={item} getTime={this.getTime} nav={this.props.navigation} userName={this.state.username}/>
                            )
                        }
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        showsVerticalScrollIndicator={false}
                    />
                )
            }else{
                return(
                    <View>
                        <Text>Non hai ancora alcuna chat!</Text>
                    </View>
                )
            }
        }else{
            return(<Loading/>)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold"
    },
    singleChat: {
        borderBottomWidth: 1,
        flex: 1,
        flexDirection: 'column',
        marginLeft: wp("3%")
    },
    singleChatContainer: {
        flexDirection: 'row',
        margin: wp("3%"),
        height: hp("10%")
    },
    userPhoto: {
        width: wp("15%"),
        height: wp("15%"),
        borderRadius: wp("15%")
    },
    circle:{
        width:36,
        height:36,
        borderRadius:18,   //half radius will make it cirlce,
        backgroundColor:'green'
    }
});
