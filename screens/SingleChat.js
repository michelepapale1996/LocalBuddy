import React, {Component} from 'react'
import {StyleSheet, View} from "react-native"
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import SingleChatHandler from "../handler/SingleChatHandler"
import MessagesUpdatesHandler from "../handler/MessagesUpdatesHandler"
import AccountHandler from "../handler/AccountHandler"
import { Text, TouchableRipple } from 'react-native-paper'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import UserHandler from "../handler/UserHandler";
import firebase from 'react-native-firebase'

export default class SingleChat extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#2fa1ff'
            },
            headerTitleStyle: {
                color: 'white'
            },
            headerTitle:
                <TouchableRipple
                    onPress={() => {
                        const name = navigation.getParam("opponentNameAndSurname", "Error")
                        if(name != "Account Deleted"){
                            navigation.navigate('BuddyProfile', {idUser: navigation.getParam("buddyId", null)})
                        }
                    }}
                    rippleColor="rgba(0, 0, 0, .32)"
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>{navigation.state.params.opponentNameAndSurname}</Text>
                    </View>
                </TouchableRipple>
        }
    }

    constructor(props){
        super(props)
        this.state = {
            CCopponentUserId: props.navigation.getParam('CCopponentUserId', 'Error'),
            chatId : props.navigation.getParam('chatId', 'Error'),
            urlPhotoOther: props.navigation.getParam("urlPhotoOther", "Error"),
            opponentNameAndSurname: props.navigation.getParam("opponentNameAndSurname", "Error"),
            opponentId: props.navigation.getParam("opponentUserId", "Error"),
            messages: []
        }
        this.props.navigation.setParams({buddyId: this.state.opponentId})
    }

    componentDidMount() {
        const urlPhotoOther = this.state.urlPhotoOther
        const userId = firebase.auth().currentUser.uid

        //used for the notification
        UserHandler.getNameAndSurname(userId).then(nameAndSurname => {
            this.setState({nameAndSurname: nameAndSurname})
        })

        if(this.state.chatId != null){
            SingleChatHandler.retrieveChatHistory(this.state.chatId, 100, null, urlPhotoOther).then(messages => this.setState({messages: messages}))
        }
        MessagesUpdatesHandler.addListener(this.onMessageRcvd)
    }

    componentWillUnmount(){
        MessagesUpdatesHandler.removeListeners(this.onMessageRcvd)
    }

    //local parameter is a bool that is true if the msg is sent from the loggedUser
    onMessageRcvd = (payload, local)=>{
        console.log(payload)

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
            <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: 1,
                }}
            />
        )
    }
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        justifyContent: 'center',
        width: wp("80%")
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color:"white"
    },
})
