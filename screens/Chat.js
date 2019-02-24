import {GiftedChat} from 'react-native-gifted-chat'
import React, {Component} from "react";

export default class Chat extends Component {

    componentDidMount(){
        //SingleChatHandler.createConversation(76774)
        //SingleChatHandler.listConversations()
        //SingleChatHandler.connectToChat()

        this.state = {
            messages: []
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