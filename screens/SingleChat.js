import React, {Component} from 'react'
import {StyleSheet, View} from "react-native"
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import SingleChatHandler from "../handler/SingleChatHandler"
import MessagesUpdatesHandler from "../updater/MessagesUpdatesHandler"
import LinearGradient from 'react-native-linear-gradient';
import { Text, TouchableRipple } from 'react-native-paper'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc, removeOrientationListener as rol} from 'react-native-responsive-screen';
import UserHandler from "../handler/UserHandler";
import firebase from 'react-native-firebase'
import LocalChatsHandler from "../LocalHandler/LocalChatsHandler";
import NetInfoHandler from "../handler/NetInfoHandler";
import Updater from "../updater/Updater";

export default class SingleChat extends Component {
    static navigationOptions = ({ navigation }) => {
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
            }
        })

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
                        if(NetInfoHandler.isConnected){
                            const name = navigation.getParam("opponentNameAndSurname", "Error")
                            if(name != "Account Deleted"){
                                navigation.navigate('BuddyProfile', {idUser: navigation.getParam("buddyId", null)})
                            }
                        } else {
                            alert("You are not connected to the network. Check your connection and retry.")
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

    updateChat = async () => {
        if(this.state.chatId != null){
            //var messages = await SingleChatHandler.retrieveChatHistory(this.state.chatId, 100, null, urlPhotoOther)
            var messages = await LocalChatsHandler.getMessagesWith(this.state.chatId)
            messages.forEach(elem => {
                if(elem.user._id == 2) elem.user.avatar = this.state.urlPhotoOther
            })
            this.setState({messages: messages})
        }
    }

    async componentDidMount() {
        loc(this)
        const urlPhotoOther = this.state.urlPhotoOther
        const userId = firebase.auth().currentUser.uid

        //used for the notification
        UserHandler.getNameAndSurname(userId).then(nameAndSurname => {
            this.setState({nameAndSurname: nameAndSurname})
        })

        this.updateChat()
        MessagesUpdatesHandler.addListener(this.onMessageRcvd)
        Updater.addListener(this.updateChat)
    }

    componentWillUnmount(){
        rol(this)
        Updater.removeListener(this.updateChat)
        MessagesUpdatesHandler.removeListeners(this.onMessageRcvd)
    }

    //local parameter is a bool that is true if the msg is sent from the loggedUser
    onMessageRcvd = (payload, local)=>{
        if(payload.chatId == this.state.chatId){
            var id = 1
            if(!local){
                id = 2
            }

            const msg = {
                _id: Math.floor(Math.random() * 10000),
                text: payload.text,
                createdAt: payload.createdAt,
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
                    this.setState({chatId: chat._id})
                    return chat._id
                })
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
            <View style={{flex:1}}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />
            </View>
        )
    }
}
