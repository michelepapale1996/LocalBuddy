import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat'
import SingleChatHandler from "../res/SingleChatHandler";
import MessagesUpdatesHandler from "../res/MessagesUpdatesHandler"
import firebase from "react-native-firebase";
import UserHandler from "../res/UserHandler";

export default class SingleChat extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.nameAndSurname,
        };
    };

    constructor(props){
        super(props)

        this.state = {
            CCopponentUserId: this.props.navigation.getParam('CCopponentUserId', 'Error'),
            chatId : this.props.navigation.getParam('chatId', 'Error'),
            urlPhotoUser: this.props.navigation.getParam("urlPhotoUser", "Error"),
            urlPhotoOther: this.props.navigation.getParam("urlPhotoOther", "Error"),
            username: null,
            messages: []
        }
    }

    componentDidMount() {
        const urlPhotoUser = this.state.urlPhotoUser
        const urlPhotoOther = this.state.urlPhotoOther
        const userId = firebase.auth().currentUser.uid

        UserHandler.getNameAndSurname(userId).then(
            username => {
                this.setState({username: username})
                if(this.state.chatId != null){
                    SingleChatHandler.retrieveChatHistory(this.state.chatId, 100, urlPhotoUser, urlPhotoOther).then(
                        messages => this.setState({messages: messages})
                    )
                }
            }
        )

        MessagesUpdatesHandler.addListener(this.onMessageRcvd)
    }

    componentWillUnmount(){
        MessagesUpdatesHandler.removeListeners(this.onMessageRcvd)
    }

    //local parameter is a bool that is true if the msg is sent from the loggedUser
    onMessageRcvd = (msgRcvd, userId, local)=>{
        var id = 1
        //depending on the message (local/remote), the message is in text or body
        var message = msgRcvd.text
        if(!local){
            id = 2
            message = msgRcvd.body
        }
        const message = {
            _id: userId,
            text: message,
            createdAt: new Date().getTime(),
            user: {
                _id: id,
                avatar: this.state.urlPhotoOther
            }
        }
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
        }))
    }

    onSend(messages){
        //check if the chat exists
        if(this.state.chatId == null){
            //create the conversation and set the chatId
            SingleChatHandler.createConversation(this.state.CCopponentUserId).then(chat => {
                SingleChatHandler.sendMessage(messages[0].text, chat._id, this.state.CCopponentUserId, this.state.username, this.state.CCopponentUserId, this.state.urlPhotoOther)
            })
        }else{
            SingleChatHandler.sendMessage(messages[0].text, this.state.chatId, this.state.CCopponentUserId, this.state.username, this.state.CCopponentUserId, this.state.urlPhotoOther)

        }
        MessagesUpdatesHandler.updateBecauseLocalSending(messages[0], this.state.CCopponentUserId)
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
