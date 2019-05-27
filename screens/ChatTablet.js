import React, {Component} from 'react'
import {StyleSheet, View, FlatList, Image } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen"
import ChatsHandler from "../handler/ChatsHandler"
import MessagesUpdatesHandler from "../handler/MessagesUpdatesHandler"
import LoadingComponent from '../components/LoadingComponent'
import { Text, TouchableRipple } from 'react-native-paper'
import {GiftedChat} from "react-native-gifted-chat";
import firebase from "react-native-firebase";
import UserHandler from "../handler/UserHandler";
import SingleChatHandler from "../handler/SingleChatHandler";
import ChatTabletHandler from "../handler/ChatTabletHandler";

function Chat(props) {
    const lastMessageTime = props.getTime(props.item.createdAt)
    return(
        <TouchableRipple
            onPress={() =>{
                //go
                ChatTabletHandler.update({
                    key: props.item.chatId,
                    chatId: props.item.chatId,
                    opponentNameAndSurname: props.item.nameAndSurname,
                    urlPhotoOther: props.item.urlPhotoOther,
                    CCopponentUserId: props.item.CCopponentUserId,
                    opponentUserId: props.item.opponentUserId
                })
            }}>
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
        </TouchableRipple>
    )
}

function AllChats(props){
    if(props.state.chats.length != 0) {
        return (
            <View style={{width:wp("30%")}}>
                <FlatList
                    data={props.state.chats}
                    renderItem={
                        ({item}) => (
                            <Chat item={item} getTime={props.getTime} nav={props.nav} modifySingleChatState={props.modifySingleChatState} userName={props.state.username}/>
                        )
                    }
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }else{
        return(
            <View style={styles.container}>
                <Text style={styles.text}>You do not have any chat yet!</Text>
            </View>
        )
    }
}

class SingleChat extends Component{
    constructor(props){
        super(props)
        ChatTabletHandler.addListener(this.updateState)
    }

    updateState = (state) => {
        console.log("ABCD")
        console.log(state)
        this.setState(state)
        const urlPhotoOther = state.urlPhotoOther
        if(state.chatId != null){
            SingleChatHandler.retrieveChatHistory(state.chatId, 100, null, urlPhotoOther).then(messages => this.setState({messages: messages}))
        }
        MessagesUpdatesHandler.addListener(this.onMessageRcvd)
    }

    componentDidMount() {
        const userId = firebase.auth().currentUser.uid

        //used for the notification
        UserHandler.getNameAndSurname(userId).then(nameAndSurname => {
            this.setState({nameAndSurname: nameAndSurname})
        })
    }

    componentWillUnmount(){
        MessagesUpdatesHandler.removeListeners(this.onMessageRcvd)
        ChatTabletHandler.removeListener()
    }

    //local parameter is a bool that is true if the msg is sent from the loggedUser
    onMessageRcvd = (payload, local)=>{
        var id = 1
        //depending on the message (local/remote), the message is in text or body
        var message = payload.text
        var chatId = payload.chatId
        if(!local){
            id = 2
            message = payload.body
            chatId = payload.dialog_id
        }

        if(chatId == this.state.chatId){
            const msg = {
                _id: Math.floor(Math.random() * 10000),
                text: message,
                createdAt: new Date().getTime(),
                user: {
                    _id: id,
                    avatar: this.state.urlPhotoOther
                }
            }
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, msg),
            }))
        }
    }

    async onSend(messages){
        if(this.state.opponentNameAndSurname != "Account Deleted") {
            var chatID = this.state.chatId
            //check if the chat exists
            if (this.state.chatId == null) {
                //create the conversation and set the chatId
                chatID = await SingleChatHandler.createConversation(this.state.CCopponentUserId).then(chat => {
                    return chat._id
                })
                this.setState({chatId: chatID})
            }
            const payload = {
                text: messages[0].text,
                chatId: chatID,
                opponentId: this.state.opponentId,
                ccOpponentUserId: this.state.CCopponentUserId,
                opponentUsername: this.state.opponentNameAndSurname,
                nameAndSurname: this.state.nameAndSurname,
                urlPhotoOther: this.state.urlPhotoOther,
                createdAt: new Date()
            }
            SingleChatHandler.sendMessage(payload)
            MessagesUpdatesHandler.updateBecauseLocalSending(payload)
        }
    }

    render() {
        return (
            <View style={{borderLeftWidth:0.5, borderColor:"grey", flex:1}}>
                {this.state != null && <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />}
            </View>
        )
    }
}

export default class ChatTablet extends Component {
    constructor(props){
        super(props)

        this.state = {
            chats: [],
            singleChatState: {},
            loadingDone: false
        }
    }

    static navigationOptions = {
        title: "Chat",
        headerStyle: {
            backgroundColor: '#2fa1ff'
        },
        headerTitleStyle: {
            color: 'white'
        }
    };

    componentWillUnmount(){
        MessagesUpdatesHandler.removeListeners(this.onMessageRcvd)
    }

    getTime = (createdAt) => {
        const time = new Date(createdAt)
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

    onMessageRcvd = (payload, isLocal)=>{
        this.setState(prevState => {
            if(isLocal) {
                var toUpdate = prevState.chats.filter((elem) => elem.chatId == payload.chatId)[0]
                var otherChats = prevState.chats.filter((elem) => elem.CCopponentUserId != payload.ccOpponentUserId)
                //if the user is starting a new conversation, toUpdate will be null
                if (toUpdate == null || toUpdate == undefined) {
                    toUpdate = {
                        chatId: payload.chatId,
                        CCopponentUserId: payload.ccOpponentUserId,
                        nameAndSurname: payload.opponentUsername,
                        urlPhotoOther: payload.urlPhotoOther
                    }
                }
                toUpdate.lastMessageText = payload.text
                var time = new Date(payload.createdAt)
                toUpdate.createdAt = time.toUTCString()

                var allChats = [toUpdate]
                //if the user has not other chats
                if (otherChats.length != 0){
                    otherChats.forEach(elem => allChats.push(elem))
                }
                return ({
                    chats: allChats
                })
            } else {
                //new message from another user
                toUpdate = prevState.chats.filter((elem) => elem.chatId == payload.dialog_id)[0]
                otherChats = prevState.chats.filter((elem) => elem.chatId != payload.dialog_id)

                //if the user is starting a new conversation, toUpdate will be null
                if(toUpdate == null || toUpdate == undefined){
                    ChatsHandler.getChats().then(chats =>{
                        this.setState({chats})
                    })
                } else {
                    toUpdate.lastMessageText = payload.body
                    var time = new Date(0); // The 0 there is the key, which sets the date to the epoch
                    time.setUTCSeconds(payload.extension.date_sent);
                    var allChats = [toUpdate]
                    //if the user has not other chats
                    if (otherChats.length != 0){
                        otherChats.forEach(elem => allChats.push(elem))
                    }
                    return ({
                        chats: allChats
                    })
                }
            }
        })
    }

    componentDidMount(){
        MessagesUpdatesHandler.addListener(this.onMessageRcvd)
        ChatsHandler.getChats().then(chats => {
            this.setState({
                chats: chats,
                loadingDone: true
            })
        })
    }

    render() {
        if(this.state.loadingDone != false){
            return(
                <View style={{flex:1, flexDirection:"row"}}>
                    <AllChats state={this.state} nav={this.props.navigation} getTime={this.getTime}/>
                    <SingleChat navigation={this.props.navigation}/>
                </View>
            )
        }else{
            return(<LoadingComponent/>)
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    text: {
        fontSize: 20,
        fontWeight: "bold"
    },
    singleChat: {
        borderBottomWidth: 1,
        borderColor:"grey",
        flex: 1,
        flexDirection: 'column',
        marginLeft: wp("1%")
    },
    singleChatContainer: {
        justifyContent: "space-between",
        flex:1,
        flexDirection: 'row',
        height: hp("9%"),
        marginLeft: wp("0.5%"),
        marginTop: hp("1%"),
    },
    userPhoto: {
        width: wp("5%"),
        height: wp("5%"),
        borderRadius: wp("15%")
    }
});