import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat'
import Db from '../res/Db'
import firebase from "react-native-firebase";

export default class SingleChat extends Component {
    constructor(props){
        super(props)

        this.state = {
            otherUserId: this.props.navigation.getParam('otherUserId', 'Error'),
            chatId : this.props.navigation.getParam('chatId', 'Error'),
            messages: []
        }
    }

    componentDidMount() {
        this.loadMessages(this.state.chatId)
    }
    
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.nameAndSurname,
        };
    };

    loadMessages = (chatId)=>{
        firebase.database().ref("/chats/" + chatId + "/messages").on("value",
            snap => {
                messages = snap.val()
                const that = this
                let toDisplay = []

                for(var key in messages){
                    const id  = firebase.auth().currentUser.uid;
                    if(id == messages[key].idUser){
                        value = 1
                        photo =  that.props.navigation.getParam("urlPhotoUser", "Error")
                    }else{
                        value = 2
                        photo = that.props.navigation.getParam("urlPhotoOther", "Error")
                    }
                    toDisplay.push({
                        _id: 1,
                        text: messages[key].text,
                        createdAt: messages[key].createdAt,
                        user: {
                            _id: value,
                            avatar: photo
                        }
                    })
                }

                //sort the messages in date order
                toDisplay.sort(function(a,b){
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

                this.setState({
                    messages: toDisplay
                })
            }
        )
    }

    onSend(messages = []) {
        const idUser = firebase.auth().currentUser.uid

        //If it is the first message between them, the chat does not exist in Db-> create it!
        if(this.state.chatId == undefined || this.state.chatId == null){
            const chatId = Db.createChatBetween(idUser, this.state.otherUserId)
            Db.sendNewMessage(chatId, idUser, messages[0])
            this.setState({
                chatId: chatId
            })
            this.loadMessages(chatId)
        }else{
            Db.sendNewMessage(this.state.chatId, idUser, messages[0])
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
    }
});
