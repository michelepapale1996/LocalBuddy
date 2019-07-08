import AsyncStorage from "@react-native-community/async-storage";
import ChatsHandler from "../handler/ChatsHandler";
import LocalUserHandler from "./LocalUserHandler";

class LocalChatsHandler {
    static async setChats(chats){
        if(chats !== null) await AsyncStorage.setItem("chats", JSON.stringify(chats));
    }

    static async setMessages(messages){
        if(messages !== null) await AsyncStorage.setItem("messages", JSON.stringify(messages));
    }

    static async getChats(){
        try {
            const value = await AsyncStorage.getItem('chats')
            if (value !== null) {
                return JSON.parse(value)
            } else {
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }

    static async getMessages(){
        try {
            const value = await AsyncStorage.getItem('messages')
            if (value !== null) {
                return JSON.parse(value)
            } else {
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }

    static async getMessagesWith(chatId){
        try {
            var messages = await AsyncStorage.getItem('messages')
            if (messages !== null) {
                messages = JSON.parse(messages)
                return messages[chatId]
            } else {
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }

    static async deleteChatWith(dialogId){
        var messages = await AsyncStorage.getItem('messages')
        if (messages !== null) {
            messages = JSON.parse(messages)
            await AsyncStorage.removeItem('messages')
            LocalChatsHandler.setMessages(messages)

            var chats = await LocalChatsHandler.getChats()
            chats = chats.filter(elem => {
                return elem.chatId != dialogId
            })
            await AsyncStorage.removeItem('chats')
            await AsyncStorage.setItem("chats", JSON.stringify(chats));
        } else {
            return []
        }
    }

    //called if there is not a dialog
    static async addChat(){
        try {
            var chats = await ChatsHandler.getChats()
            await AsyncStorage.removeItem('chats')
            await AsyncStorage.setItem("chats", JSON.stringify(chats));
        } catch (error) {
            console.log(error)
        }
    }

    //called if there is already a dialog
    static async updateChats(payload){
        try {
            var chats = await LocalChatsHandler.getChats()
            chats.forEach((elem, index) => {
                if(elem.chatId === payload.chatId){
                    chats[index].lastMessageText = payload.text
                    chats[index].createdAt = payload.createdAt
                }
            })
            await AsyncStorage.removeItem('chats')
            await AsyncStorage.setItem("chats", JSON.stringify(chats));
        } catch (error) {
            console.log(error)
        }
    }

    static async addMessage(payload, isLocal){
        try {
            var messages = await LocalChatsHandler.getMessages()
            const userInfo = await LocalUserHandler.getUserInfo()

            var msg = {
                _id: Math.floor(Math.random() * 10000),
                text: payload.text,
                createdAt: payload.createdAt,
                user: {
                    _id: 1,
                    avatar: userInfo.urlPhoto
                }
            }
            if(!isLocal){
                msg.user._id = 2
                msg.user.avatar = payload.urlPhotoOther
            }
            if(messages[payload.chatId] != null){
                LocalChatsHandler.updateChats(payload)
                //put the msg at the beginning
                messages[payload.chatId].unshift(msg)
            }else{
                //create a new chat
                LocalChatsHandler.addChat()
                messages[payload.chatId] = [msg]
            }

            await AsyncStorage.removeItem('messages')
            await AsyncStorage.setItem("messages", JSON.stringify(messages));
        } catch (error) {
            console.log(error)
        }
    }
}

LocalChatsHandler.shared = new LocalChatsHandler()
export default LocalChatsHandler