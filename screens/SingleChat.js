import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat'
import SingleChatHandler from "../res/SingleChatHandler";
import MessagesUpdatesHandler from "../res/MessagesUpdatesHandler";
import * as Animatable from "react-native-animatable"
import firebase from "react-native-firebase";
import UserHandler from "../res/UserHandler";

export default class SingleChat extends Component {
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

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.nameAndSurname,
        };
    };

    componentDidMount() {
        const urlPhotoUser = this.state.urlPhotoUser
        const urlPhotoOther = this.state.urlPhotoOther
        const userId = firebase.auth().currentUser.uid;

        UserHandler.getNameAndSurname(userId).then(
            username => {
                SingleChatHandler.retrieveChatHistory(this.state.chatId, 100, urlPhotoUser, urlPhotoOther).then(
                    messages => this.setState({
                        username: username,
                        messages: messages
                    })
                )
            }
        )

        MessagesUpdatesHandler.addListener(this.onMessageRcvd)
    }

    componentWillUnmount(){
        MessagesUpdatesHandler.removeListeners(this.onMessageRcvd)
    }

    onMessageRcvd = (msgRcvd, userId)=>{
        const message = {
            _id: userId,
            text: msgRcvd.body,
            createdAt: new Date().getTime(),
            user: {
                _id: 2,
                avatar: this.state.urlPhotoOther
            }
        }
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
        }))
    }

    onSend(messages){
        SingleChatHandler.sendMessage(messages[0].text, this.state.chatId, this.state.CCopponentUserId, this.state.username)
        const message = {
            _id: messages[0]._id,
            text: messages[0].text,
            createdAt: new Date().getTime(),
            user: {
                _id: 1,
                avatar: this.state.urlPhotoUser
            }
        }
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
        }))
    }

    renderMessages = (props) => {
        return (
            <Animatable.View animation="bounceInUp" duration={400}>
                <Bubble {...props} wrapperStyle={
                    {
                        left: {
                            backgroundColor: '#f0f0f0',
                        }
                    }}
                />
            </Animatable.View>
        );
    }

    render() {
        return (
            <GiftedChat
                renderBubble={this.renderMessages}
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
