import React, {Component} from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import SingleChatHandler from "../res/SingleChatHandler"
import MessagesUpdatesHandler from "../res/MessagesUpdatesHandler"
import AccountHandler from "../res/AccountHandler"

export default class SingleChat extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.opponentNameAndSurname,
        };
    };

    constructor(props){
        super(props)

        this.state = {
            CCopponentUserId: props.navigation.getParam('CCopponentUserId', 'Error'),
            chatId : props.navigation.getParam('chatId', 'Error'),
            urlPhotoOther: props.navigation.getParam("urlPhotoOther", "Error"),
            opponentNameAndSurname: props.navigation.getParam("opponentNameAndSurname", "Error"),
            opponentId: null,
            messages: []
        }
    }

    componentDidMount() {
        const urlPhotoOther = this.state.urlPhotoOther

        AccountHandler.getUserId(this.state.CCopponentUserId).then(opponentId => this.setState({opponentId}))

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
        var id = 1
        //depending on the message (local/remote), the message is in text or body
        var message = payload.text
        if(!local){
            id = 2
            message = payload.body
        }
        const message = {
            _id: id,
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

    async onSend(messages){
        var chatID = this.state.chatId
        //check if the chat exists
        if(this.state.chatId == null){
            //create the conversation and set the chatId
            chatID = await SingleChatHandler.createConversation(this.state.CCopponentUserId).then(chat => {
                return chat._id
            })
        }
        const payload = {
            text: messages[0].text,
            chatId: chatID,
            opponentId: this.state.opponentId,
            ccOpponentUserId: this.state.CCopponentUserId,
            opponentUsername: this.state.opponentNameAndSurname,
            urlPhotoOther: this.state.urlPhotoOther,
            createdAt: new Date()
        }
        SingleChatHandler.sendMessage(payload)
        MessagesUpdatesHandler.updateBecauseLocalSending(payload)
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
