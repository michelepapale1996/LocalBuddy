import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat'
import firebase from "react-native-firebase";
import SingleChatHandler from "../res/SingleChatHandler";

export default class SingleChat extends Component {
    constructor(props){
        super(props)

        this.state = {
            CCopponentUserId: this.props.navigation.getParam('CCopponentUserId', 'Error'),
            chatId : this.props.navigation.getParam('chatId', 'Error'),
            urlPhotoUser: this.props.navigation.getParam("urlPhotoUser", "Error"),
            urlPhotoOther: this.props.navigation.getParam("urlPhotoOther", "Error"),
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
        SingleChatHandler.retrieveChatHistory(this.state.chatId, 100, urlPhotoUser, urlPhotoOther).then(
            messages => this.setState({
                messages: messages
            })
        )
    }

    onSend(messages){
        SingleChatHandler.sendMessage(messages[0].text, this.state.chatId, this.state.CCopponentUserId)
        var toDisplay = this.state.messages
        toDisplay.push({
            _id: messages[0]._id,
            text: messages[0].text,
            createdAt: new Date().getTime(),
            user: {
                _id: 1,
                avatar: this.state.urlPhotoUser
            }
        })
        //sort the messages in date order
        toDisplay.sort(function(a,b){
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        this.setState({messages: toDisplay})
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
